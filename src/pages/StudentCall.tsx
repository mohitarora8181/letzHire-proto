import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, MessageCircle } from 'lucide-react';
import Button from '../components/common/Button';

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

// Simple job data
const jobData = {
    "type": "software-engineer",
    "name": "Software Engineer",
    "skills": [
        { "name": "React" },
        { "name": "MERN" },
        { "name": "Next.js" },
        { "name": "Python" },
        { "name": "C++" }
    ],
    "duration": 7
};

// Initialize VAPI globally - outside the component
const apiKey = import.meta.env.VITE_VAPI_WEB_TOKEN || "";
const vapi = new Vapi(apiKey);

const StudentCall: React.FC = () => {
    const navigate = useNavigate();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<Message[]>([]);
    const [candidateName, setCandidateName] = useState("Mohit");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [partialTranscript, setPartialTranscript] = useState<string>("");
    const [profileImage, setProfileImage] = useState("https://avatars.githubusercontent.com/u/108920156?v=4");

    const { id } = useParams<{ id: string }>();

    // Set up event handlers
    useEffect(() => {
        // Simplified event handlers
        const onCallStart = () => {
            const systemPrompt = `You are conducting a technical interview for a Software Engineer position.
            Focus on asking about the candidate's experience with: ${jobData.skills.map(s => s.name).join(", ")}.
            Keep responses brief and conversational.
            This is a ${jobData.duration} minute interview.
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
            console.log("📩 Message:", message);

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
    }, []);

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
        setCallStatus(CallStatus.CONNECTING);

        try {
            // Clear any previous messages
            setMessages([]);

            // Start the call with configuration
            await vapi.start("d3751e31-cf3c-49d8-a0c0-6e951acee68d");

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
    const endCall = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-full justify-between">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Software Engineer Interview</h1>
                <p className="text-gray-500">Skills required: {jobData.skills.map(s => s.name).join(", ")}</p>
            </div>

            {/* Setup Form */}
            {callStatus === CallStatus.INACTIVE && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Interview Setup</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your name"
                        />
                    </div>
                    <Button
                        onClick={startCall}
                        disabled={!candidateName.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        <Mic className="mr-2" size={16} />
                        Start Interview
                    </Button>
                </div>
            )}

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
                                src={profileImage}
                                alt={candidateName}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            {isListening && (
                                <span className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse" />
                            )}
                        </div>
                        <h3 className="mt-3 font-medium text-lg">{candidateName}</h3>
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
                                            : profileImage}
                                        alt={messages[messages.length - 1].role === "assistant" ? "AI" : candidateName}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {messages[messages.length - 1].role === "assistant" ? "AI Interviewer" : candidateName}
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
            <div className="flex justify-center mb-4">
                {callStatus === CallStatus.ACTIVE ? (
                    <Button
                        onClick={endCall}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
                    >
                        <MicOff className="mr-2" size={16} />
                        End Interview
                    </Button>
                ) : callStatus === CallStatus.FINISHED && (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-2">Interview completed</p>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setCallStatus(CallStatus.INACTIVE)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                            >
                                Start New Interview
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCall;