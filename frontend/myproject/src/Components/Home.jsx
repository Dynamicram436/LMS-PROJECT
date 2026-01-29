import apiClient from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { BarChart, PieChart } from "@mui/x-charts";
import { FaBook, FaChalkboardTeacher, FaCertificate, FaClock, FaGraduationCap, FaTrophy, FaChartLine, FaFire, FaStar } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

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

        // Fetch user info
        try {
          const userResponse = await apiClient.get(
            `/auth/user/${userData.userid}`,
            { signal }
          );

          if (userResponse?.data?.data) {
            setUser(userResponse.data.data);
            userData.courseProgress =
              userResponse.data.data.courseProgress || [];
            localStorage.setItem("user", JSON.stringify(userData));
          } else if (userResponse?.data?.message === "User not found") {
            setUser(userData);
          }
        } catch (userErr) {
          console.error("Error fetching user:", userErr);
          setUser(userData);
        }

        // Fetch exam results
        try {
          const resultsResponse = await apiClient.get(
            `/exam/results/${userData.userid}`,
            {
              signal,
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          if (resultsResponse?.data?.success) {
            const results = Array.isArray(resultsResponse.data.data)
              ? resultsResponse.data.data
              : [];
            setExamResults(results);
            const updatedUser = { ...userData, examResults: results };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            setExamResults(userData.examResults || []);
          }
        } catch (_error) {
          console.error("Error fetching exam results:", _error);
          setExamResults(userData.examResults || []);
          if (_error.response?.status === 401) {
            localStorage.removeItem("user");
            navigate("/login");
            toast.error("Session expired. Please log in again.");
          }
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const handleExamSubmission = (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.userid === event.detail.userId) {
        fetchUserData();
      }
    };

    window.addEventListener("examSubmitted", handleExamSubmission);

    // Listen for progress updates from exams
    const handleProgressUpdate = (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.userid === event.detail.userId) {
        fetchUserData();
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);

    return () => {
      controller.abort();
      window.removeEventListener("examSubmitted", handleExamSubmission);
      window.removeEventListener("progressUpdated", handleProgressUpdate);
    };
  }, []);

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 70) return "💪";
    if (percentage >= 50) return "📚";
    return "✍️";
  };

  const refreshExamResults = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const userData = JSON.parse(storedUser);
      const resultsResponse = await apiClient.get(
        `/exam/results/${userData.userid}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (resultsResponse?.data?.success) {
        const results = Array.isArray(resultsResponse.data.data)
          ? resultsResponse.data.data
          : [];
        setExamResults(results);
        const updatedUser = { ...userData, examResults: results };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Exam data refreshed!");
      }
    } catch (_error) {
      toast.error("Failed to refresh exam data", _error);
    }
  };

  // Calculate statistics
  const totalCourses = examResults.length;
  const totalAttempts = examResults.reduce(
    (sum, course) => sum + (course.examAttempts?.length || 0),
    0
  );
  const passedCourses = examResults.filter(course =>
    course.examAttempts?.some(attempt => attempt.passed)
  ).length;
  const averageScore = totalAttempts > 0 
    ? Math.round(examResults.reduce((sum, course) => {
        if (course.examAttempts && course.examAttempts.length > 0) {
          const latestAttempt = course.examAttempts[course.examAttempts.length - 1];
          return sum + (latestAttempt.score || 0);
        }
        return sum;
      }, 0) / totalAttempts)
    : 0;

  // Prepare chart data
  const chartData = examResults
    .map((course) => {
      const latestAttempt =
        course.examAttempts && course.examAttempts.length > 0
          ? course.examAttempts[course.examAttempts.length - 1]
          : { score: 0 };
      return {
        course: course.courseName || course.courseId,
        score: latestAttempt.score || 0,
      };
    })
    .slice(0, 5); // Show only top 5 for better visualization

  // Prepare pie chart data for performance breakdown
  const performanceData = [
    { label: 'Passed', value: passedCourses },
    { label: 'In Progress', value: totalCourses - passedCourses },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-slate-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SkillTrack</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Student"}! 👋</h1>
              <p className="text-indigo-100 max-w-2xl">
                Ready to continue your learning journey? Track your progress and achieve your goals.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100">Courses</div>
                <div className="text-2xl font-bold">{totalCourses}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100">Avg. Score</div>
                <div className="text-2xl font-bold">{averageScore}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBook className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Exams Taken</p>
                <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaChalkboardTeacher className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Passed Courses</p>
                <p className="text-3xl font-bold text-gray-900">{passedCourses}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaTrophy className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Score</p>
                <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
                <button
                  onClick={refreshExamResults}
                  className="text-gray-500 hover:text-gray-700"
                  title="Refresh exam data"
                >
                  
                </button>
              </div>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <BarChart
                    dataset={chartData}
                    xAxis={[{ scaleType: "band", dataKey: "course" }]}
                    series={[
                      {
                        dataKey: "score",
                        label: "Score %",
                        color: "#4f46e5",
                      },
                    ]}
                    margin={{ top: 10, bottom: 50, left: 60, right: 20 }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No performance data available
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
              {examResults.length > 0 ? (
                <div className="space-y-4">
                  {examResults.slice(0, 3).map((course, idx) => {
                    const latestAttempt =
                      course.examAttempts?.length > 0
                        ? course.examAttempts[course.examAttempts.length - 1]
                        : null;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          navigate(
                            `/performance/${encodeURIComponent(
                              course.courseId
                            )}`
                          )
                        }
                        className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform">
                            {latestAttempt
                              ? getScoreEmoji(latestAttempt.score || 0)
                              : "📖"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 truncate max-w-xs">
                              {course.courseName || course.courseId}
                            </h4>
                            {latestAttempt ? (
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                  {latestAttempt.score}%
                                </span>
                                <span className="text-xs text-gray-500">
                                  {course.examAttempts?.length} attempt(s)
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 mt-1 italic">
                                Not started yet
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {latestAttempt?.passed ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
                              Passed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full">
                              In Progress
                            </span>
                          )}
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all border border-transparent group-hover:border-indigo-100">
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                    📚
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    No activity yet
                  </h4>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Start your first course to see your learning activity here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Course Progress & Quick Actions */}
          <div className="space-y-8">
            {/* Course Progress */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Course Progress</h3>
              <div className="h-64">
                {performanceData.some(d => d.value > 0) ? (
                  <PieChart
                    series={[{
                      data: performanceData,
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                    }]}
                    margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                  <span className="text-xs text-gray-600">Passed ({passedCourses})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#8dd1e1] rounded-full"></div>
                  <span className="text-xs text-gray-600">In Progress ({totalCourses - passedCourses})</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/viewcourses")}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaBook className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Browse Courses</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/performance/all")}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaChartLine className="text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">View Performance</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaGraduationCap className="text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">My Profile</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaFire className="text-xl" />
                <h3 className="text-lg font-bold">Learning Streak</h3>
              </div>
              <p className="text-orange-100 text-sm mb-4">
                Keep up the momentum! Consistent learning leads to success.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-orange-100 text-sm">Days in a row</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
