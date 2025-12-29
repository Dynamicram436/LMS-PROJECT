import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });
  const [userInitial, setUserInitial] = useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.name?.charAt(0).toUpperCase() || "";
      } catch {
        return "";
      }
    }
    return "";
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem("user");
      setIsLoggedIn(!!userData);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user.name) {
            setUserInitial(user.name.charAt(0).toUpperCase());
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserInitial("");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                L
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 hidden sm:block">
                SkillUp
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === "/home"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-500"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to={isLoggedIn ? "/viewcourses" : "/login"}
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error("Please log in to see courses");
                }
              }}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === "/viewcourses"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-500"
              }`}
            >
              Courses
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                  {userInitial || "U"}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-600 text-sm font-bold hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
