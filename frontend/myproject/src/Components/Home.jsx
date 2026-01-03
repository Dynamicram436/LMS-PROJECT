import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        if (!userData?.userid) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch user info (no auth required for this endpoint)
        try {
          const userResponse = await axios.get(
            `http://localhost:8000/api/auth/user/${userData.userid}`
          );

          if (userResponse?.data?.data) {
            setUser(userResponse.data.data);
          } else if (userResponse?.data?.message === "User not found") {
            // User not found in database, use stored user data
            setUser(userData);
          }
        } catch (userErr) {
          console.error("Error fetching user:", userErr);
          // If user fetch fails, use stored user data as fallback
          setUser(userData);
        }

        // Fetch exam results (optional - don't show error if it fails)
        try {
          const resultsResponse = await axios.get(
            `http://localhost:8000/api/exam/results/${userData.userid}`
          );
          if (
            resultsResponse?.data?.success &&
            Array.isArray(resultsResponse.data.data)
          ) {
            setExamResults(resultsResponse.data.data);
          }
        } catch (resultsErr) {
          // Silently fail for exam results - user might not have taken any exams yet
          console.log(
            "Exam results not available:",
            resultsErr.response?.data?.message || resultsErr.message
          );
          setExamResults([]);
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        // Only show error for critical failures
        if (err.message && !err.message.includes("Invalid user data")) {
          toast.error("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 70) return "💪";
    if (percentage >= 50) return "📚";
    return "✍️";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Welcome Section */}
        <div className="pt-24 pb-12">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 mb-6 border border-indigo-100">
                Hi {user?.name || "Student"} 👋 Welcome back!
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Master your skills <br />
                <span className="text-indigo-600">with LMS</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Explore comprehensive courses, track your performance, and
                achieve your learning goals. Everything you need to succeed is
                right here at your fingertips.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (localStorage.getItem("user")) {
                      navigate("/viewcourses");
                    } else {
                      toast.error("Please log in to explore courses");
                      navigate("/login");
                    }
                  }}
                  className="px-8 py-4 cursor-pointer bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  🚀 Explore Courses
                </button>
                {!user && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-8 py-4 cursor-pointer bg-white text-indigo-600 font-bold border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-8 py-4 cursor-pointer bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    📊
                  </span>
                  At a Glance
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      Exams Attempted
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {examResults.length}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      Courses Started
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      --
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                  <svg
                    className="w-32 h-32"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-2">Keep it up!</h4>
                  <p className="text-indigo-100 text-sm mb-6">
                    You're making great progress in your learning journey.
                  </p>
                  <button
                    onClick={() => navigate("/viewcourses")}
                    className="w-full py-3 cursor-pointer bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    View My Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      🎯
                    </span>
                    Recent Performance
                  </h3>
                  <Link
                    to="/performance/overall"
                    className="text-indigo-600 text-sm font-semibold hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {examResults.length > 0 ? (
                  <div className="space-y-4">
                    {examResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-100 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <button
                          type="button"
                          
                          className="w-full flex items-center gap-4 text-left focus:outline-none hover:bg-indigo-50/50 rounded-xl p-1 transition"
                        >
                          <div className="text-3xl bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-slate-50">
                            {getScoreEmoji(result.score)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">
                              {result.courseName}
                            </h4>
                            <p className="text-sm text-slate-500">
                              Attempted recently
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                              {result.score}%
                            </p>
                            <p
                              className={`text-xs font-bold uppercase tracking-wider ${
                                result.passed
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {result.passed
                                ? "Passed"
                                : "Needs Still more Preparation"}
                            </p>
                          </div>
                          <div className="h-10 w-[2px] bg-slate-100 hidden sm:block"></div>
                          <button
                          onClick={() => navigate(`/performance/${encodeURIComponent(result.courseId)}`)}
                            className="p-2 hover:bg-white cursor-pointer  rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">
                      👻
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      No results yet
                    </h4>
                    <p className="text-slate-500 max-w-xs">
                      Time to start learning! Take your first exam to see your
                      performance here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
