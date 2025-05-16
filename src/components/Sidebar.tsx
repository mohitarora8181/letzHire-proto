import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Briefcase, Mic, LogOut } from "lucide-react"; // import LogOut icon
import { getAuth, signOut } from "firebase/auth";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show error UI to the user
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col justify-between h-screen">
      <div>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-700">LetzHire</h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 ${
                isActive ? "active" : ""
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
                isActive ? "active" : ""
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
                isActive ? "active" : ""
              }`
            }
          >
            <Mic size={20} />
            <span>AI Interviewer</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          type="button"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
