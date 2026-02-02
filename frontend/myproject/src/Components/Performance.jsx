import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { subjectsData } from "../Courses/courseCatalog";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTrophy,
  FaChartLine,
  FaHistory,
  FaStar,
  FaFire,
  FaMedal,
  FaAward,
  FaBookOpen,
  FaLightbulb,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Performance = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);
  const [allExamData, setAllExamData] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isOverallView =
    !category ||
    category === "overall" ||
    category === "all" ||
    category === "";

  // Function to refresh exam results
  const refreshExamResults = useCallback(async () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData?.userid) {
      toast.error("Please log in to refresh performance data");
      return;
    }

    try {
      console.log(`Refreshing performance data for user: ${userData.userid}`);

      const response = await apiClient.get(`/exam/results/${userData.userid}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      console.log("Performance data response:", response.data);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to fetch performance data",
        );
      }

      const examResults = Array.isArray(response.data.data)
        ? response.data.data.filter(Boolean)
        : [];

      console.log(`Received ${examResults.length} exam result entries`);

      setAllExamData(examResults);

      if (isOverallView) {
        // For overall view, find the first course with attempts
        const courseWithAttempts = examResults.find(
          (course) => course.examAttempts?.length > 0,
        );

        if (courseWithAttempts) {
          setExamData(courseWithAttempts);
          if (courseWithAttempts.examAttempts?.[0]) {
            setSelectedAttempt(courseWithAttempts.examAttempts[0]);
          }
        }
      } else if (subject) {
        // For specific subject view
        const subjectStr = String(subject).trim().toLowerCase();
        const courseData = examResults.find((result) => {
          if (!result) return false;
          const courseId = String(result.courseId || "")
            .trim()
            .toLowerCase();
          const courseName = String(result.courseName || "")
            .trim()
            .toLowerCase();
          return (
            courseId === subjectStr ||
            courseName === subjectStr ||
            courseId.startsWith(`${subjectStr}-`) ||
            courseName.includes(subjectStr)
          );
        });

        if (courseData) {
          setExamData(courseData);
          if (courseData.examAttempts?.[0]) {
            setSelectedAttempt(courseData.examAttempts[0]);
          }
        } else {
          toast.warning("No performance data found for this course");
        }
      }

      // Update localStorage with fresh data
      userData.examResults = examResults;
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Performance data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing performance data:", error);
      console.error("Error details:", error.response || error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to refresh performance data";
      toast.error(errorMessage);
    }
  }, [isOverallView, subject, setAllExamData, setExamData, setSelectedAttempt]);

  const getFullCourseName = (idOrName) => {
    if (!idOrName) return "Course";
    const subjectEntry = subjectsData.find(
      (s) =>
        s.id.toLowerCase() === idOrName.toLowerCase() ||
        s.name.toLowerCase() === idOrName.toLowerCase(),
    );
    return subjectEntry ? subjectEntry.name : idOrName;
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!userData?.userid) {
        toast.error("Please log in to view performance data");
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(
          `/exam/results/${userData.userid}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
        );

        console.log("Initial performance data response:", response.data);

        if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "Failed to fetch performance data",
          );
        }

        const examResults = Array.isArray(response.data.data)
          ? response.data.data.filter(Boolean) // Remove any null/undefined entries
          : [];

        console.log(
          `Loaded ${examResults.length} exam result entries initially`,
        );

        setAllExamData(examResults);

        if (examResults.length === 0) {
          setLoading(false);
          return;
        }

        if (isOverallView) {
          // For overall view, find the first course with attempts
          const courseWithAttempts = examResults.find(
            (course) => course.examAttempts?.length > 0,
          );

          if (courseWithAttempts) {
            setExamData(courseWithAttempts);
            if (courseWithAttempts.examAttempts?.[0]) {
              setSelectedAttempt(courseWithAttempts.examAttempts[0]);
            }
          }
        } else if (subject) {
          // For specific subject view
          const subjectStr = String(subject).trim().toLowerCase();
          const courseData = examResults.find((result) => {
            if (!result) return false;
            const courseId = String(result.courseId || "")
              .trim()
              .toLowerCase();
            const courseName = String(result.courseName || "")
              .trim()
              .toLowerCase();
            return (
              courseId === subjectStr ||
              courseName === subjectStr ||
              courseId.startsWith(`${subjectStr}-`) ||
              courseName.includes(subjectStr)
            );
          });

          if (courseData) {
            setExamData(courseData);
            if (courseData.examAttempts?.[0]) {
              setSelectedAttempt(courseData.examAttempts[0]);
            }
          } else {
            toast.warning("No performance data found for this course");
          }
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
        console.error("Error details:", error.response || error.message);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load performance data";
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();

    // Listen for exam submission events to refresh data
    const handleExamSubmission = (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.userid === event.detail.userId) {
        console.log(
          "Detected exam submission for current user, refreshing performance data...",
        );
        fetchPerformanceData();
      }
    };

    window.addEventListener("examSubmitted", handleExamSubmission);

    // Listen for progress updates
    const handleProgressUpdate = (event) => {
      if (user?.userid === event.detail.userId) {
        // Optimistic update
        const { courseId, completionPercentage } = event.detail;

        setAllExamData((prevData) => {
          if (!prevData) return prevData;
          return prevData.map((course) => {
            if (course.courseId === courseId) {
              return { ...course, completionPercentage: completionPercentage };
            }
            return course;
          });
        });

        setExamData((prev) => {
          if (prev && prev.courseId === courseId) {
            return { ...prev, completionPercentage: completionPercentage };
          }
          return prev;
        });

        refreshExamResults();
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);

    return () => {
      window.removeEventListener("examSubmitted", handleExamSubmission);
      window.removeEventListener("progressUpdated", handleProgressUpdate);
    };
  }, [
    subject,
    isOverallView,
    category,
    navigate,
    user?.userid,
    refreshExamResults,
  ]);

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 70) return "💪";
    if (percentage >= 50) return "📚";
    return "✍️";
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90)
      return {
        level: "Expert",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: FaTrophy,
      };
    if (score >= 80)
      return {
        level: "Advanced",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: FaAward,
      };
    if (score >= 70)
      return {
        level: "Proficient",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: FaMedal,
      };
    if (score >= 60)
      return {
        level: "Developing",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: FaStar,
      };
    return {
      level: "Beginner",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: FaLightbulb,
    };
  };

  const getStreakInfo = (attempts) => {
    if (!attempts || attempts.length === 0) return { current: 0, best: 0 };
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    attempts.forEach((attempt, index) => {
      const passed = attempt.passed || false;
      if (passed) {
        tempStreak++;
        if (index === attempts.length - 1) currentStreak = tempStreak;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    return { current: currentStreak, best: bestStreak };
  };

  const getImprovementTrend = (attempts) => {
    if (!attempts || attempts.length < 2)
      return { trend: "neutral", change: 0 };
    const recent = attempts.slice(-5);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    const firstAvg =
      firstHalf.reduce((sum, a) => sum + (a.score || 0), 0) /
      (firstHalf.length || 1);
    const secondAvg =
      secondHalf.reduce((sum, a) => sum + (a.score || 0), 0) /
      (secondHalf.length || 1);
    const change = secondAvg - firstAvg;
    if (change > 5) return { trend: "up", change: Math.round(change) };
    if (change < -5) return { trend: "down", change: Math.round(change) };
    return { trend: "neutral", change: 0 };
  };

  const globalStats = React.useMemo(() => {
    if (!isOverallView || allExamData.length === 0) return null;
    const allAttempts = allExamData
      .flatMap((course) =>
        (course.examAttempts || []).map((attempt) => ({
          ...attempt,
          courseName: course.courseName,
          courseId: course.courseId,
        })),
      )
      .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
    const totalAttempts = allAttempts.length;
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            allAttempts.reduce((sum, a) => sum + (a.score || 0), 0) /
              totalAttempts,
          )
        : 0;
    const passedAttempts = allAttempts.filter((a) => a.passed).length;
    const passingRate =
      totalAttempts > 0
        ? Math.round((passedAttempts / totalAttempts) * 100)
        : 0;
    const subjectsCleared = new Set(
      allAttempts.filter((a) => a.passed).map((a) => a.courseId),
    ).size;
    return {
      allAttempts,
      totalAttempts,
      avgScore,
      passingRate,
      subjectsCleared,
    };
  }, [allExamData, isOverallView]);

  const currentScore =
    isOverallView && globalStats ? globalStats.avgScore : examData?.score || 0;
  const currentAttempts =
    isOverallView && globalStats
      ? [...globalStats.allAttempts].reverse()
      : examData?.examAttempts || [];
  const currentCompletionPercentage =
    isOverallView && globalStats
      ? Math.round(
          allExamData.reduce(
            (sum, c) => sum + (c.completionPercentage || 0),
            0,
          ) / (allExamData.length || 1),
        )
      : examData?.completionPercentage || 0;
  const performanceLevel = getPerformanceLevel(currentScore);
  const streakInfo = getStreakInfo(currentAttempts);
  const improvementTrend = getImprovementTrend(currentAttempts);
  const PerformanceIcon = performanceLevel.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-slate-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-slate-400/50 animate-pulse font-medium">
            Loading performance data...
          </p>
        </div>
      </div>
    );
  }

  if (!examData && !isOverallView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Performance Data Found
          </h2>
          <p className="text-gray-500 mb-6">
            {!user?.userid
              ? "Please log in to view your performance data."
              : "You haven't attempted any exams for this course yet."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/viewcourses")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            {!user?.userid && (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isOverallView && allExamData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Performance Data Found
          </h2>
          <p className="text-gray-500 mb-6">
            {!user?.userid
              ? "Please log in to view your performance data."
              : "You haven't attempted any exams yet. Start learning to track your progress!"}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/viewcourses")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
            {!user?.userid && (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Performance - SkillTrack</title>
        <meta name="Performance page" content="Welcome to Performance page" />
      </Helmet>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full transition-colors duration-200 shadow-sm"
        >
          <FaArrowLeft />
          <span className="font-bold text-sm">Back</span>
        </button>

        <div className="max-w-6xl mx-auto relative z-10 mt-12">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {isOverallView ? "Analytics" : "Performance Analytics"}
              </h1>
              <button
                onClick={refreshExamResults}
                className="text-gray-500 hover:text-gray-700"
                title="Refresh data"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-lg">
              {isOverallView
                ? "Detailed analytics of your learning progress and performance"
                : `${getFullCourseName(subject)} - Detailed Exam Results`}
            </p>
          </div>

          {isOverallView && allExamData.length > 0 && (
            <div className="space-y-12 mb-12">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                  All Exam Attempts - Unified View
                </h3>
                <div className="space-y-4">
                  {globalStats?.allAttempts?.map((attempt, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedAttempt(attempt);
                        const element =
                          document.getElementById("question-analysis");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`p-5 border rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group ${
                        selectedAttempt?.attemptId === attempt.attemptId
                          ? "bg-blue-50 border-blue-300 shadow-sm"
                          : "bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left rounded-xl transition">
                        <div className="text-3xl bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform">
                          {getScoreEmoji(attempt.score)}
                        </div>
                        <div>
                          <h4
                            className={`font-bold text-lg transition-colors ${
                              selectedAttempt?.attemptId === attempt.attemptId
                                ? "text-blue-600"
                                : "text-gray-800 group-hover:text-blue-600"
                            }`}
                          >
                            {getFullCourseName(
                              attempt.courseName || attempt.courseId,
                            )}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
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
                            Score: {attempt.score}%
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {attempt.attemptDate
                                ? new Date(
                                    attempt.attemptDate,
                                  ).toLocaleDateString()
                                : "Recent"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex flex-col text-right">
                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${
                              attempt.passed ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {attempt.passed
                              ? "✅ Passed"
                              : "📚 Still need to be Focused"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Attempt #{attempt.attemptNumber || index + 1}
                          </p>
                        </div>
                        <div className="h-10 w-0.5 bg-gray-200 hidden sm:block"></div>
                        <div
                          className={`p-2 transition-colors ${
                            selectedAttempt?.attemptId === attempt.attemptId
                              ? "text-blue-600"
                              : "text-gray-300 group-hover:text-blue-600"
                          }`}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Statistics */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                  Overall Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {globalStats.totalAttempts}
                    </div>
                    <div className="text-gray-500 text-sm">Total Attempts</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {globalStats.avgScore}%
                    </div>
                    <div className="text-gray-500 text-sm">Average Score</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {Math.round(
                        allExamData.reduce(
                          (sum, c) => sum + (c.completionPercentage || 0),
                          0,
                        ) / (allExamData.length || 1),
                      )}
                      %
                    </div>
                    <div className="text-gray-500 text-sm">
                      Overall Curriculum Progress
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {globalStats.subjectsCleared}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Subjects Cleared
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isOverallView && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <PerformanceIcon
                      className={`text-3xl ${performanceLevel.color}`}
                    />
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${performanceLevel.bg} ${performanceLevel.border} ${performanceLevel.color}`}
                    >
                      {performanceLevel.level}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {currentScore}%
                  </div>
                  <div className="text-gray-500 text-sm">Overall Score</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <FaHistory className="text-3xl text-blue-600" />
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                      Active
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {currentAttempts.length}
                  </div>
                  <div className="text-gray-500 text-sm">Total Attempts</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <FaFire className="text-3xl text-orange-600" />
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600">
                      Hot!
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {streakInfo.current}
                  </div>
                  <div className="text-gray-500 text-sm">Current Streak</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <FaBookOpen className="text-3xl text-green-600" />
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-600">
                      Curriculum
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {currentCompletionPercentage}%
                  </div>
                  <div className="text-gray-500 text-sm">
                    {currentCompletionPercentage > 0
                      ? "Study Progress"
                      : "Start Learning to Track Progress"}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FaChartLine
                      className={`text-2xl ${
                        improvementTrend.trend === "up"
                          ? "text-green-600"
                          : improvementTrend.trend === "down"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Recent Performance
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Based on last 5 attempts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        improvementTrend.trend === "up"
                          ? "text-green-600"
                          : improvementTrend.trend === "down"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {improvementTrend.trend === "up"
                        ? "↑"
                        : improvementTrend.trend === "down"
                          ? "↓"
                          : "→"}{" "}
                      {Math.abs(improvementTrend.change)}%
                    </div>
                    <div className="text-gray-500 text-sm">
                      {improvementTrend.trend === "up"
                        ? "Improving"
                        : improvementTrend.trend === "down"
                          ? "Declining"
                          : "Stable"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {isOverallView && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                All Chapters Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">
                        Chapter Name
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-gray-900">
                        Exam Score
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-gray-900">
                        Study Progress
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-gray-900">
                        Status
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(allExamData) && allExamData.length > 0 ? (
                      allExamData.map((course, idx) => {
                        if (!course) return null;
                        const bestScore = course.score || 0;
                        const passed = course.passed || false;

                        return (
                          <tr
                            key={`${course.courseId || "course"}-${idx}`}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4 text-gray-900 font-medium">
                              {getFullCourseName(
                                course.courseName || course.courseId,
                              )}
                            </td>
                            <td className="text-center py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {bestScore}%
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-4 px-4">
                              <div className="w-full max-w-[100px] mx-auto bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{
                                    width: `${
                                      course.completionPercentage || 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 mt-1 block">
                                {course.completionPercentage || 0}% Complete
                              </span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  passed
                                    ? "bg-green-50 border border-green-200 text-green-600"
                                    : "bg-yellow-50 border border-yellow-200 text-yellow-600"
                                }`}
                              >
                                {passed ? "✅ Passed" : "📚 Learning"}
                              </span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/performance/${encodeURIComponent(
                                      course.courseId,
                                    )}`,
                                  )
                                }
                                className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-gray-500"
                        >
                          No exam data available. Complete an exam to see your
                          performance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isOverallView && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaHistory className="text-blue-600" />
                Attempt History
              </h3>
              <div className="space-y-3">
                {currentAttempts && currentAttempts.length > 0 ? (
                  <div className="space-y-3">
                    {currentAttempts.map((attempt, index) => (
                      <div
                        key={attempt.attemptId || index}
                        onClick={() => {
                          setSelectedAttempt(attempt);
                          // Scroll to question analysis section when an attempt is clicked
                          setTimeout(() => {
                            const element =
                              document.getElementById("question-analysis");
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }, 100);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          selectedAttempt?.attemptId === attempt.attemptId
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <span className="text-blue-600 font-bold">
                                {`#${attempt.attemptNumber || index + 1}`}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-bold">
                                  {attempt.score || 0}%
                                </span>
                                <span className="text-sm text-gray-500">
                                  {attempt.attemptDate
                                    ? new Date(
                                        attempt.attemptDate,
                                      ).toLocaleDateString()
                                    : "Recent"}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {attempt.totalQuestions
                                  ? `${attempt.correctAnswers || 0} of ${
                                      attempt.totalQuestions
                                    } correct`
                                  : "Details not available"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                attempt.passed
                                  ? "bg-green-50 border border-green-200 text-green-600"
                                  : "bg-red-50 border border-red-200 text-red-600"
                              }`}
                            >
                              {attempt.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
                            </span>
                            {selectedAttempt?.attemptId ===
                              attempt.attemptId && (
                              <FaCheckCircle className="text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">📚</div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">
                      No exam attempts yet
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You haven't taken any exams for this course yet. Complete
                      a quiz or exam to track your progress here.
                    </p>
                    <button
                      onClick={() => navigate(-1)}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go Back to Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Analysis Section - Shows only incorrect answers */}
          {!isOverallView &&
            selectedAttempt &&
            selectedAttempt.answers &&
            selectedAttempt.answers.length > 0 && (
              <div
                id="question-analysis"
                className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaChartLine className="text-blue-600" />
                  Questions You Got Wrong
                </h3>

                <div className="space-y-4">
                  {selectedAttempt.answers
                    .filter((answer) => !answer.isCorrect)
                    .map((answer, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-red-50 border border-red-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-900">
                                Question {answer.questionIndex + 1}:
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-800">
                                ✗ INCORRECT
                              </span>
                            </div>

                            <div className="mb-3">
                              <p className="text-gray-800 font-medium">
                                {answer.question}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {answer.options &&
                                answer.options.map((option, optIndex) => {
                                  const isSelected =
                                    answer.selectedOption === optIndex;

                                  let optionClass = "p-2 rounded border";
                                  if (isSelected) {
                                    optionClass += " bg-red-100 border-red-300"; // Selected answer
                                  } else {
                                    optionClass +=
                                      " bg-gray-50 border-gray-200"; // Not selected
                                  }

                                  return (
                                    <div key={optIndex} className={optionClass}>
                                      <span className="mr-2 font-medium">
                                        {String.fromCharCode(65 + optIndex)}.
                                      </span>
                                      <span>{option}</span>
                                      {isSelected && (
                                        <span className="ml-2 text-blue-600">
                                          (Your answer)
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>

                            {answer.explanation && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Explanation:
                                  </span>{" "}
                                  {answer.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Show message if all questions were answered correctly */}
                  {selectedAttempt.answers.every(
                    (answer) => answer.isCorrect,
                  ) && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4 text-green-500">🎉</div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">
                        Perfect Score!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        You got all questions correct in this attempt.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Performance;
