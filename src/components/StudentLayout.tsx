import { BookOpen } from 'lucide-react';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <StudentSidebar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

const StudentSidebar: React.FC = () => {
    return (
        <div className="bg-white shadow-md w-64 min-h-screen flex flex-col">
            {/* Logo Area */}
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-indigo-700">LetzHire</h1>
                <p className="text-sm text-gray-500">Student Portal</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                <ul>
                    <li>
                        <NavLink
                            to="/student/interviews"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <BookOpen className="mr-3 h-5 w-5" />
                            Interviews
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Profile */}
            <div className="p-4 border-t mt-auto">
                <div className="flex items-center">
                    <img
                        src="https://avatars.githubusercontent.com/u/108920156?v=4"
                        alt="Student Profile"
                        className="h-8 w-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Mohit Arora</p>
                        <p className="text-xs text-gray-500">Student</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;