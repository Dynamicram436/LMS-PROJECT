import apiClient from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  FaBook,
  FaChalkboardTeacher,
  FaCertificate,
  FaClock,
  FaGraduationCap,
  FaTrophy,
  FaChartLine,
  FaFire,
  FaStar,
  FaArrowRight,
  FaUserGraduate,
  FaTasks,
  FaMedal,
} from "react-icons/fa";

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
  const passedCourses = examResults.filter((course) =>
    course.examAttempts?.some((attempt) => attempt.passed)
  ).length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          examResults.reduce((sum, course) => {
            if (course.examAttempts && course.examAttempts.length > 0) {
              const latestAttempt =
                course.examAttempts[course.examAttempts.length - 1];
              return sum + (latestAttempt.score || 0);
            }
            return sum;
          }, 0) / totalAttempts
        )
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
    { label: "Passed", value: passedCourses },
    { label: "In Progress", value: totalCourses - passedCourses },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-blue-600 font-medium">
            Loading your learning dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SkillTrack LMS</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 ml-5">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Learning Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {user?.name || "Learner"}!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">
                    Enrolled Courses
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {totalCourses}
                  </div>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <div className="text-xs text-green-600 font-medium">
                    Avg. Score
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    {averageScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalCourses}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (totalCourses / 10) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Progress towards goal
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Exams Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalAttempts}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaTasks className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (totalAttempts / 20) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Assessment progress
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Courses Passed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {passedCourses}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaMedal className="text-yellow-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        totalCourses > 0
                          ? (passedCourses / totalCourses) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Completion rate</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Performance
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {averageScore}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${averageScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Overall performance
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Analytics */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Performance Analytics
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Your course performance overview
                    </p>
                  </div>
                  <button
                    onClick={refreshExamResults}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Refresh Data
                    <FaArrowRight className="text-xs" />
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
                          color: "#3b82f6",
                        },
                      ]}
                      margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <FaChartLine className="text-4xl mb-3" />
                      <p className="font-medium">
                        No performance data available
                      </p>
                      <p className="text-sm mt-1">
                        Complete some courses to see your analytics
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Activity
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Your latest learning progress
                    </p>
                  </div>
                  {examResults.length > 3 && (
                    <button
                      onClick={() => navigate("/performance/all")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      View All
                      <FaArrowRight className="text-xs" />
                    </button>
                  )}
                </div>
                {examResults.length > 0 ? (
                  <div className="space-y-4">
                    {(examResults.length > 3
                      ? examResults.slice(0, 3)
                      : examResults
                    ).map((course, idx) => {
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
                          className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
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
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
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

                          <div className="flex items-center gap-3">
                            {latestAttempt?.passed ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
                                Completed
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full">
                                In Progress
                              </span>
                            )}
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                              <FaArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                      <FaGraduationCap className="text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      No learning activity yet
                    </h4>
                    <p className="text-gray-500 text-sm max-w-xs mb-4">
                      Enroll in courses to start your learning journey and track
                      your progress.
                    </p>
                    <button
                      onClick={() => navigate("/viewcourses")}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                      <FaArrowRight className="ml-2 text-xs" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Learning Progress
                </h3>
                <div className="h-52 mb-4">
                  {performanceData.some((d) => d.value > 0) ? (
                    <PieChart
                      series={[
                        {
                          data: performanceData,
                          innerRadius: 40,
                          outerRadius: 80,
                          paddingAngle: 3,
                          cornerRadius: 5,
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          faded: {
                            innerRadius: 40,
                            additionalRadius: -20,
                            color: "gray",
                          },
                          color: ["#10b981", "#f59e0b"],
                        },
                      ]}
                      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <FaTasks className="text-3xl mb-2" />
                      <p className="text-sm">No progress data</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {passedCourses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {totalCourses - passedCourses}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Quick Access
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/viewcourses")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <FaBook className="text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          Browse Courses
                        </div>
                        <div className="text-xs text-gray-500">
                          Discover new learning opportunities
                        </div>
                      </div>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate("/performance/all")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <FaChartLine className="text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          View Progress
                        </div>
                        <div className="text-xs text-gray-500">
                          Track your learning journey
                        </div>
                      </div>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <FaUserGraduate className="text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          My Profile
                        </div>
                        <div className="text-xs text-gray-500">
                          Manage your account settings
                        </div>
                      </div>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaFire className="text-2xl" />
                  <div>
                    <h3 className="text-lg font-bold">Learning Streak</h3>
                    <p className="text-orange-100 text-sm">
                      Consistency is key to success
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-4xl font-bold mb-1">7</div>
                  <div className="text-orange-100 text-sm">
                    Consecutive Days
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-orange-100 text-xs">
                    Keep up the great work!
                  </p>
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
