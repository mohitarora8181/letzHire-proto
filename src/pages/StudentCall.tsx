import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, MessageCircle, ArrowLeft, Loader2, Video } from 'lucide-react';
import Button from '../components/common/Button';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// Simple status enum
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

// Message interface
interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
}

interface Technology {
    name: string;
    color?: string;
}

interface InterviewData {
    title: string;
    duration: number;
    technologies: Technology[];
    language: string;
    codingExercise: boolean;
    proctoring: boolean;
}

// Initialize VAPI globally - outside the component
const apiKey = import.meta.env.VITE_VAPI_WEB_TOKEN || "";
const vapi = new Vapi(apiKey);

// Add a function to create Tavus conversation
const createTavusConversation = async (systemPrompt: string) => {
    try {
        const response = await fetch('https://tavusapi.com/v2/conversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_TAVUS_APIKEY
            },
            body: JSON.stringify({
                conversation_name: "Alex",
                conversational_context: systemPrompt,
                replica_id: "r6ae5b6efc9d"
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create Tavus conversation: ${response.statusText}`);
        }

        const data = await response.json();
        return data.conversation_url.replace("https://tavus.daily.co/", ""); // Return the conversation ID
    } catch (error) {
        console.error("Error creating Tavus conversation:", error);
        throw error;
    }
};

const StudentCall: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { userData } = useAuth();

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [partialTranscript, setPartialTranscript] = useState<string>("");

    // State for interview data
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add a state variable to store the call ID
    const [callId, setCallId] = useState<string | null>(null);

    // Add these new states
    const [creatingVideo, setCreatingVideo] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    // Fetch interview data from Firestore
    useEffect(() => {
        const fetchInterviewData = async () => {
            if (!id) {
                setError("Interview ID is missing");
                setLoading(false);
                return;
            }

            try {
                const db = getFirestore();
                const interviewDocRef = doc(db, "interviews", id);
                const interviewDoc = await getDoc(interviewDocRef);

                if (interviewDoc.exists()) {
                    setInterviewData(interviewDoc.data() as InterviewData);
                } else {
                    setError("Interview not found");
                }
            } catch (err) {
                console.error("Error fetching interview:", err);
                setError("Failed to load interview data");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviewData();
    }, [id]);

    // Set up event handlers
    useEffect(() => {
        // Simplified event handlers
        const onCallStart = () => {
            if (!interviewData) return;

            const systemPrompt = `You are conducting a technical interview for a ${interviewData.title} position.
            Focus on asking about the candidate's experience with: ${interviewData.technologies?.map(t => t.name).join(", ") || "relevant technologies"}.
            Keep responses brief and conversational.
            This is a ${interviewData.duration} minute interview.
            Your name is Alex and you are the technical interviewer.`;

            console.log("✅ Call started");
            setCallStatus(CallStatus.ACTIVE);

            vapi.send({
                type: 'add-message',
                message: {
                    role: "system",
                    content: systemPrompt
                }
            });
        };

        const onCallEnd = () => {
            console.log("✅ Call ended");
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript") {
                if (message.transcriptType === "partial" && message.role === "user") {
                    setPartialTranscript(message.transcript);
                } else if (message.transcriptType === "final") {
                    setPartialTranscript("");
                    const newMessage = {
                        role: message.role,
                        content: message.transcript,
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, newMessage]);
                }
            }
        };

        const onSpeechStart = () => {
            console.log("🔊 AI started speaking");
            setIsListening(false);
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log("🔇 AI stopped speaking");
            setIsListening(true);
            setIsSpeaking(false);
        };

        const onError = (error: any) => {
            if (error?.type === 'no-room') {
                console.log('✅ Call ended normally, room cleaned up.');
                return;
            }
            console.error("🛑 VAPI error:", error);
        };

        // Register event handlers
        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        // Clean up event listeners on unmount
        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, [interviewData]);

    // Update last message when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }

        // Keep the auto-scrolling behavior
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Start the interview call
    const startCall = async () => {
        if (!interviewData) return;

        setCallStatus(CallStatus.CONNECTING);

        try {
            // Clear any previous messages
            setMessages([]);

            // Start the call with configuration
            const call = await vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);

            // Store the call ID
            if (call && call.id) {
                setCallId(call.id);
                console.log("Call ID:", call.id);
            }

            console.log("Call init successful");
        } catch (error: any) {
            console.error("❌ Failed to start call:", error);
            setCallStatus(CallStatus.INACTIVE);
            setMessages([{
                role: "system",
                content: `Failed to start call: ${error?.message || "Unknown error"}`,
                timestamp: Date.now()
            }]);
        }
    };

    // End the interview call
    const endCall = async () => {
        try {
            // Say goodbye
            vapi.say("Our time's up, goodbye!", true);

            // Update call status
            setCallStatus(CallStatus.FINISHED);

            // Stop the call
            vapi.stop();

            // If we have valid data, update Firestore
            if (userData?.uid && id && callId) {
                const db = getFirestore();

                // 1. Update the user document - add interview to user's list
                const userDocRef = doc(db, "users", userData.uid);
                await updateDoc(userDocRef, {
                    interviews: arrayUnion({
                        interviewId: id,            // The interview template ID
                        callId: callId,             // The specific call instance ID
                        title: interviewData?.title || "Interview",
                        completedOn: new Date().toISOString(),
                        status: "completed"
                    })
                });

                // 2. Update the interview document - add user to the students array
                const interviewDocRef = doc(db, "interviews", id);
                await updateDoc(interviewDocRef, {
                    students: arrayUnion(userData.uid),
                    taken: increment(1) // Increment the taken count
                });

                console.log("Interview records updated successfully");
            } else {
                console.warn("Missing data for saving interview:", {
                    userId: userData?.uid,
                    interviewId: id,
                    callId
                });
            }
        } catch (error) {
            console.error("Error ending call or saving interview:", error);
        }
    };

    // Add a handler for starting video interview
    const handleStartVideoInterview = async () => {
        if (!interviewData) return;

        setCreatingVideo(true);
        setVideoError(null);

        try {
            // Create system prompt for the video interview
            const systemPrompt = `You are conducting a technical interview for a ${interviewData.title} position.
            Focus on asking about the candidate's experience with: ${interviewData.technologies?.map(t => t.name).join(", ") || "relevant technologies"}.
            Keep responses brief and conversational.
            This is a ${interviewData.duration} minute interview.
            Your name is Alex and you are the technical interviewer.`;

            // Create the Tavus conversation
            const conversationId = await createTavusConversation(systemPrompt);

            // Navigate to the video interview page
            navigate(`/student/videointerview/${conversationId}`);
        } catch (error) {
            console.error("Failed to start video interview:", error);
            setVideoError("Failed to initialize video interview. Please try again.");
        } finally {
            setCreatingVideo(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600">Loading interview data...</p>
            </div>
        );
    }

    // Error state
    if (error || !interviewData) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-red-700">{error || "Failed to load interview"}</p>
                    <button
                        onClick={() => navigate('/student/interviews')}
                        className="mt-4 inline-flex items-center text-red-600 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Return to interviews
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-full justify-between">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => navigate('/student/interviews')}
                        className="text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold">{interviewData.title} Interview</h1>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {interviewData.technologies?.map((tech, index) => (
                        <span
                            key={index}
                            className={`${tech.color || 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded`}
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Call Status */}
            {callStatus === CallStatus.CONNECTING && (
                <div className="bg-yellow-50 p-4 rounded-md mb-6 text-center">
                    <p className="text-yellow-700 font-medium">Connecting... Please wait</p>
                </div>
            )}

            {/* New UI Design - Participants Cards */}
            {callStatus !== CallStatus.INACTIVE && (
                <div className="grid grid-cols-2 gap-8 mb-6">
                    {/* AI Interviewer Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <div className="relative">
                            <img
                                src="https://readyforai.com/wp-content/uploads/2018/08/Artificial-intelligence-face.jpg"
                                alt="AI Interviewer"
                                className="w-32 h-32 rounded-full object-cover grayscale"
                            />
                            {isSpeaking && (
                                <span className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse" />
                            )}
                        </div>
                        <h3 className="mt-3 font-medium text-lg">AI Interviewer</h3>
                    </div>

                    {/* User Profile Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={userData?.photoURL || "https://avatars.githubusercontent.com/u/108920156?v=4"}
                                alt={userData?.name || "Candidate"}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            {isListening && (
                                <span className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse" />
                            )}
                        </div>
                        <h3 className="mt-3 font-medium text-lg">{userData?.name || "Candidate"}</h3>
                    </div>
                </div>
            )}

            {/* Last message highlight - Updated UI */}
            {callStatus === CallStatus.ACTIVE && lastMessage && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center mb-3">
                        <MessageCircle className="text-blue-500 mr-2" size={18} />
                        <h3 className="font-semibold text-gray-800">Recent Message</h3>
                    </div>

                    <div className="flex items-start gap-3">
                        {messages.length > 0 && (
                            <>
                                <div className="flex-shrink-0">
                                    <img
                                        src={messages[messages.length - 1].role === "assistant"
                                            ? "https://readyforai.com/wp-content/uploads/2018/08/Artificial-intelligence-face.jpg"
                                            : userData?.photoURL || "https://avatars.githubusercontent.com/u/108920156?v=4"}
                                        alt={messages[messages.length - 1].role === "assistant" ? "AI" : (userData?.name || "Candidate")}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {messages[messages.length - 1].role === "assistant" ? "AI Interviewer" : (userData?.name || "Candidate")}
                                        <span className="text-xs text-gray-500 ml-2">
                                            {new Date(messages[messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </p>
                                    <p className="text-gray-800 leading-relaxed">{lastMessage}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {isListening && (
                        <div className="flex items-center mt-3 pl-12">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" style={{ animationDelay: "200ms" }}></span>
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
                            <span className="text-xs text-gray-500 ml-2">Listening...</span>
                        </div>
                    )}

                    {isSpeaking && (
                        <div className="flex items-center mt-3 pl-12">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse" style={{ animationDelay: "200ms" }}></span>
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
                            <span className="text-xs text-gray-500 ml-2">AI is speaking...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col items-center mb-4">
                {callStatus === CallStatus.ACTIVE ? (
                    <Button
                        onClick={endCall}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
                    >
                        <MicOff className="mr-2" size={16} />
                        End Interview
                    </Button>
                ) : callStatus === CallStatus.INACTIVE ? (
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <Button
                            onClick={startCall}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full w-full"
                        >
                            <Mic className="mr-2" size={16} />
                            Start Voice Interview
                        </Button>

                        <div className="relative">
                            <Button
                                onClick={handleStartVideoInterview}
                                disabled={creatingVideo}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full w-full flex justify-center items-center"
                            >
                                {creatingVideo ? (
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                ) : (
                                    <Video className="mr-2" size={16} />
                                )}
                                Video Interview
                                <div className="ml-2">
                                    <span className="inline-block bg-indigo-300 text-indigo-900 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                        BETA
                                    </span>
                                </div>
                            </Button>

                            {videoError && (
                                <p className="text-red-500 text-xs mt-1 text-center">{videoError}</p>
                            )}
                        </div>
                    </div>
                ) : callStatus === CallStatus.FINISHED && (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-2">Interview completed</p>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => navigate('/student/interviews')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                            >
                                Back to Interviews
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCall;