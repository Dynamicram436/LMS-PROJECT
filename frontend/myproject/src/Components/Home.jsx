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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Welcome Section */}
        <div className="pt-24 pb-12">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-200 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-6 border border-blue-100">
                Hi {user?.name || "Student"} 👋 Welcome back!
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Master your skills <br />
                <span className="text-blue-600">with LMS</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
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
                  className="px-8 py-4 cursor-pointer bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  🚀 Explore Courses
                </button>
                {!user && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-8 py-4 cursor-pointer bg-white text-blue-600 font-bold border-2 border-blue-100 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-8 py-4 cursor-pointer bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
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
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    📊
                  </span>
                  At a Glance
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Exams Attempted
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {examResults.length}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Courses Started
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      --
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-2">Keep it up!</h4>
                  <p className="text-blue-100 text-sm mb-6">
                    You're making great progress in your learning journey.
                  </p>
                  <button
                    onClick={() => navigate("/viewcourses")}
                    className="w-full py-3 cursor-pointer bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View My Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      🎯
                    </span>
                    Recent Performance
                  </h3>
                  <Link
                    to="/performance/overall"
                    className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
                  >
                    View all
                  </Link>
                </div>

                {examResults.length > 0 ? (
                  <div className="space-y-4">
                    {examResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-200 hover:bg-gray-50 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <button
                          type="button"
                          className="w-full flex items-center gap-4 text-left focus:outline-none hover:bg-gray-50 rounded-xl p-1 transition"
                        >
                          <div className="text-3xl bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center border border-gray-200">
                            {getScoreEmoji(result.score)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">
                              {result.courseName}
                            </h4>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Attempted recently
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-6">
                          <div className="flex flex-col text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {result.score}%
                            </p>
                            <p
                              className={`text-xs font-bold uppercase tracking-wider ${result.passed
                                  ? "text-green-600"
                                  : "text-red-500"
                                }`}
                            >
                              {result.passed
                                ? "✅ Passed"
                                : "📚 Needs Still more Preparation"}
                            </p>
                          </div>
                          <div className="h-10 w-[2px] bg-gray-200 hidden sm:block"></div>
                          <button
                            onClick={() => navigate(`/performance/${encodeURIComponent(result.courseId)}`)}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors text-gray-400 hover:text-blue-600"
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
                                strokeWidth={2}
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
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4">
                      👻
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-2">
                      No results yet
                    </h4>
                    <p className="text-gray-500 max-w-sm leading-relaxed">
                      Time to start learning! Take your first exam to see your
                      performance here and track your amazing progress.
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
