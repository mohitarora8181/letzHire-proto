import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface Interview {
    id: string;
    title: string;
    company: string;
    date: string;
    duration: number;
    skills: string[];
    status: 'upcoming' | 'completed' | 'missed';
}

const InterviewListPage: React.FC = () => {
    const [interviews, setInterviews] = useState<Interview[]>([
        {
            id: '1',
            title: 'Software Engineer',
            company: 'TechCorp Inc.',
            date: '2025-05-18T14:00:00',
            duration: 45,
            skills: ['React', 'TypeScript', 'Node.js'],
            status: 'upcoming'
        }
    ]);

    const getStatusBadgeClass = (status: string) => {
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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Interviews</h1>
            </div>

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
                                    <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(interview.status)}`}>
                                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm">{interview.company}</p>

                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <div className="flex items-center mr-4">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(interview.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center mr-4">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center">
                                        {interview.duration} minutes
                                    </div>
                                </div>

                                <div className="flex flex-wrap mt-3 gap-1">
                                    {interview.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default InterviewListPage;