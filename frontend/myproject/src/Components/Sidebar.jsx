import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaThLarge,
    FaBook,
    FaUser,
    FaSignOutAlt,
    FaChevronRight,
    FaGraduationCap
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
            icon: <FaThLarge className="text-xl" />,
        },
        {
            path: "/viewcourses",
            name: "Courses",
            icon: <FaBook className="text-xl" />,
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <FaUser className="text-xl" />,
        },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-4xl z-40 transition-all duration-300">
            {/* Brand Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800 ">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FaGraduationCap className="text-2xl" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    LMS
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <span className="font-semibold">{item.name}</span>
                            </div>
                            {isActive && <FaChevronRight className="text-xs" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800 mb-4">
                <button
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-4 w-full p-4 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 font-semibold group"
                >
                    <FaSignOutAlt className="text-xl group-hover:rotate-12 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
