import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Briefcase, Mic, Users } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-700">LetzHire</h1>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `sidebar-link flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <Search size={20} />
          <span>Search</span>
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `sidebar-link flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <Briefcase size={20} />
          <span>Open Jobs</span>
        </NavLink>
        <NavLink
          to="/ai-interview"
          className={({ isActive }) =>
            `sidebar-link flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <Mic size={20} />
          <span>AI Interviewer</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;