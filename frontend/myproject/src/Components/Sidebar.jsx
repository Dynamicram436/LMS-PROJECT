import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaBook,
  FaUser,
  FaSignOutAlt,
  FaChevronRight,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/home",
      name: "Dashboard",
      icon: <FaThLarge className="text-lg" />,
    },
    {
      path: "/performance/overall",
      name: "Analytics",
      icon: <FaChartLine className="text-lg" />,
    },
    {
      path: "/viewcourses",
      name: "Courses",
      icon: <FaBook className="text-lg" />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <FaUser className="text-lg" />,
    },

  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl z-50 transition-all duration-300 border-r border-slate-700">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-700 bg-slate-800/50">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <FaGraduationCap className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            EduLMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Learning Platform</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${isActive
                      ? "bg-indigo-500/30 text-indigo-300"
                      : "text-slate-400 group-hover:text-white group-hover:bg-slate-600/30"
                    }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium flex-1">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/30 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
          <div className="p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
            <FaSignOutAlt className="text-lg group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
