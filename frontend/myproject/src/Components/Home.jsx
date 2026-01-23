import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

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
            `http://localhost:8000/api/auth/user/${userData.userid}`,
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
            `http://localhost:8000/api/exam/results/${userData.userid}`,
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
            resultsErr.response?.data?.message || resultsErr.message,
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SkillTrack</title>
        <meta
          name="Dashboard page"
          content="Welcome to SkillTrack - Your learning platform"
        />
      </Helmet>
      <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Welcome Section */}
          <div className="pt-20 pb-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 mb-6">
                Welcome back, {user?.name || "Student"} 👋
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Master your skills
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Explore comprehensive courses, track your performance, and
                achieve your learning goals. Everything you need to succeed is
                here.
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
                  className="px-8 py-3 cursor-pointer bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Explore Courses
                </button>
                {!user && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-8 py-3 cursor-pointer bg-white text-gray-900 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-8 py-3 cursor-pointer bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Overview */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900">
                    Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">
                        Exams Attempted
                      </span>
                      <span className="text-3xl font-bold text-gray-900">
                        {examResults.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">
                        Courses Started
                      </span>
                      <span className="text-3xl font-bold text-gray-900">
                        --
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-semibold mb-2">Keep it up</h4>
                    <p className="text-gray-300 text-sm mb-6">
                      You're making great progress in your learning journey.
                    </p>
                    <button
                      onClick={() => navigate("/viewcourses")}
                      className="w-full py-2 cursor-pointer bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      View My Courses
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Performance
                    </h3>
                    {examResults.length > 0 && (
                      <button
                        onClick={() => navigate("/performance/all")}
                        className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        View All
                        <svg
                          className="w-4 h-4"
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
                    )}
                  </div>

                  {examResults.length > 0 ? (
                    <div className="space-y-3">
                      {examResults.slice(0, 3).map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            navigate(
                              `/performance/${encodeURIComponent(result.courseId)}`,
                            )
                          }
                          className="p-5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="text-3xl bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center border border-gray-300 group-hover:scale-105 transition-transform">
                              {getScoreEmoji(result.score)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                {result.courseName}
                              </h4>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {result.score}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right">
                              <p
                                className={`text-xs font-semibold uppercase tracking-wide ${result.passed ? "text-gray-700" : "text-gray-600"}`}
                              >
                                {result.passed
                                  ? "✅ Passed"
                                  : "📚 Review needed"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {result.attempts} attempt
                                {result.attempts !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors hidden sm:block"
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
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="text-5xl mb-4">📚</div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">
                        No exams taken yet
                      </h4>
                      <p className="text-gray-600 max-w-sm">
                        Start your first course and take an exam to see your
                        performance metrics here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
