import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, AlertCircle, Users, Code } from 'lucide-react';
import { collection, getDocs, query, where, getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface Technology {
    name: string;
    color: string;
}

interface Interview {
    id: string;
    title: string;
    createdOn: string;
    duration: number;
    language: string;
    proctoring: boolean;
    codingExercise: boolean;
    customQuestions: boolean;
    hasOpenJob: boolean;
    invited: number;
    taken: number;
    technologies: Technology[];
    type: 'standard' | 'custom';
    status?: 'upcoming' | 'completed' | 'missed';
    students?: string[];
}

const InterviewListPage: React.FC = () => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!userData?.uid) {
                setLoading(false);
                return;
            }

            try {
                const db = getFirestore();
                // Fetch all interviews
                const interviewsRef = collection(db, 'interviews');
                const querySnapshot = await getDocs(interviewsRef);

                const fetchedInterviews: Interview[] = [];

                // Also fetch the user document to get their completed interviews
                const userDocRef = doc(db, "users", userData.uid);
                const userDoc = await getDoc(userDocRef);
                const userCompletedInterviews = userDoc.exists() && userDoc.data().interviews
                    ? userDoc.data().interviews.map((i: any) => i.interviewId)
                    : [];

                querySnapshot.forEach((doc) => {
                    const interviewData = { id: doc.id, ...doc.data() } as Interview;
                    const interviewDate = new Date(interviewData.createdOn);
                    const now = new Date();

                    // Check if this interview is in the user's completed list
                    const hasCompleted = userCompletedInterviews.includes(doc.id);

                    // Or check if the user's ID is in the students array of the interview
                    const hasStudentCompleted = interviewData.students &&
                        Array.isArray(interviewData.students) &&
                        interviewData.students.includes(userData.uid);

                    // Set status based on completion or date
                    if (hasCompleted || hasStudentCompleted) {
                        interviewData.status = 'completed';
                    } else if (interviewDate > now) {
                        interviewData.status = 'upcoming';
                    } else {
                        interviewData.status = 'missed';
                    }

                    fetchedInterviews.push(interviewData);
                });

                setInterviews(fetchedInterviews);
            } catch (err) {
                console.error("Error fetching interviews:", err);
                setError("Failed to load interviews. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, [userData?.uid]);

    const getStatusBadgeClass = (status?: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'missed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Interviews</h1>
            </div>

            {interviews.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <p className="text-gray-600">No interviews available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Check back later for upcoming interviews.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {interviews.map((interview) => (
                        <Link
                            key={interview.id}
                            to={`/student/interview/${interview.id}`}
                            className="block border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h2 className="font-semibold text-lg">{interview.title}</h2>
                                        {interview.status && (
                                            <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(interview.status)}`}>
                                                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                            </span>
                                        )}
                                        {interview.type === 'custom' && (
                                            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                                Custom
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <div className="flex items-center mr-4">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(interview.createdOn).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center mr-4">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {interview.duration} minutes
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mt-3 gap-1">
                                        {interview.technologies && interview.technologies.map((tech, index) => (
                                            <span
                                                key={index}
                                                className={`${tech.color || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded`}
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex mt-3 gap-4">
                                        {interview.language && (
                                            <span className="inline-flex items-center text-xs text-gray-500">
                                                <span className="bg-gray-100 p-1 rounded-full mr-1">🌐</span>
                                                {interview.language}
                                            </span>
                                        )}
                                        {interview.codingExercise && (
                                            <span className="inline-flex items-center text-xs text-gray-500">
                                                <Code className="h-3 w-3 mr-1" />
                                                Coding Exercise
                                            </span>
                                        )}
                                        {interview.proctoring && (
                                            <span className="inline-flex items-center text-xs text-gray-500">
                                                <span className="bg-gray-100 p-1 rounded-full mr-1">👁️</span>
                                                Proctored
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InterviewListPage;