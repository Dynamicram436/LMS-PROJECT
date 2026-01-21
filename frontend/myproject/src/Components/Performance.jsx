import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaChartLine,
  FaBrain,
  FaHistory,
  FaStar,
  FaFire,
  FaMedal,
  FaAward,
  FaBookOpen,
  FaLightbulb,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

const Performance = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);
  const [allExamData, setAllExamData] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const user = JSON.parse(localStorage.getItem("user"));
  const isOverallView = category === "overall" || category === "all";

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!user?.userid) {
        toast.error("User not logged in");
        navigate("/home");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam/results/${user.userid}`,
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          console.log("Raw exam data:", response.data.data);
          if (response.data.data.length > 0) {
            console.log("First course:", response.data.data[0]);
            console.log("First course examAttempts:", response.data.data[0].examAttempts);
            if (response.data.data[0].examAttempts && response.data.data[0].examAttempts.length > 0) {
              console.log("First exam attempt:", response.data.data[0].examAttempts[0]);
              console.log("First exam answers:", response.data.data[0].examAttempts[0].answers);
            }
          }
          setAllExamData(response.data.data);

          if (isOverallView) {
            if (response.data.data.length > 0) {
              setExamData(response.data.data[0]);
              if (
                response.data.data[0].examAttempts &&
                response.data.data[0].examAttempts.length > 0
              ) {
                setSelectedAttempt(response.data.data[0].examAttempts[0]);
              }
            }
          } else {
            const subjectStr = String(subject || "").trim();
            const courseData = response.data.data.find((result) => {
              const courseIdStr = String(result.courseId || "").trim();
              const courseNameStr = String(result.courseName || "").trim();
              return (
                courseIdStr.toLowerCase() === subjectStr.toLowerCase() ||
                courseNameStr.toLowerCase() === subjectStr.toLowerCase() ||
                courseIdStr
                  .toLowerCase()
                  .startsWith(subjectStr.toLowerCase() + "-") ||
                courseNameStr.toLowerCase().includes(subjectStr.toLowerCase())
              );
            });

            if (courseData) {
              setExamData(courseData);
              if (
                courseData.examAttempts &&
                courseData.examAttempts.length > 0
              ) {
                setSelectedAttempt(courseData.examAttempts[0]);
              }
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        toast.error("Failed to load performance data");
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user?.userid, subject, navigate, isOverallView, category, user]);

  const toggleQuestionExpansion = (questionIndex) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

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
    console.log("allExamData:", allExamData);
    const allAttempts = allExamData
      .flatMap((course) =>
        (course.examAttempts || []).map((attempt) => ({
          ...attempt,
          courseName: course.courseName,
          courseId: course.courseId,
        })),
      )
      .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
    console.log("allAttempts:", allAttempts);
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
  const performanceLevel = getPerformanceLevel(currentScore);
  const streakInfo = getStreakInfo(currentAttempts);
  const improvementTrend = getImprovementTrend(currentAttempts);
  const PerformanceIcon = performanceLevel.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 animate-pulse font-medium">
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
            No Performance Data
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't attempted any exams for this course yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
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
            No Performance Data
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't attempted any exams yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-8 cursor-pointer z-50 flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full transition-colors duration-200 shadow-sm"
      >
        <FaArrowLeft />
        <span className="font-bold text-sm">Back</span>
      </button>

      <div className="max-w-6xl mx-auto relative z-10 mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isOverallView
              ? "Universal Knowledge Explorer"
              : "Performance Analytics"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isOverallView
              ? "A comprehensive overview of all your learning achievements"
              : `${subject} - Detailed Exam Results`}
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
                {console.log("Rendering attempts:", globalStats?.allAttempts)}
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
                          {attempt.courseName || attempt.courseId}
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
                          className={`text-xs font-bold uppercase tracking-wider ${attempt.passed ? "text-green-600" : "text-red-500"}`}
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
                    {globalStats.passingRate}%
                  </div>
                  <div className="text-gray-500 text-sm">Passing Rate</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {globalStats.subjectsCleared}
                  </div>
                  <div className="text-gray-500 text-sm">Subjects Cleared</div>
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
                  <FaTrophy className="text-3xl text-yellow-600" />
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600">
                    Record
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {streakInfo.best}
                </div>
                <div className="text-gray-500 text-sm">Best Streak</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FaChartLine
                    className={`text-2xl ${improvementTrend.trend === "up" ? "text-green-600" : improvementTrend.trend === "down" ? "text-red-600" : "text-yellow-600"}`}
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
                    className={`text-2xl font-bold ${improvementTrend.trend === "up" ? "text-green-600" : improvementTrend.trend === "down" ? "text-red-600" : "text-yellow-600"}`}
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
                      Best Score
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">
                      Attempts
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
                  {allExamData.map((course, idx) => {
                    const bestScore = course.score || 0;
                    const totalAttempts =
                      course.attempts ||
                      (course.examAttempts ? course.examAttempts.length : 0);
                    const passed = course.passed || false;
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-900 font-medium">
                          {course.courseName}
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">
                              {getScoreEmoji(bestScore)}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {bestScore}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 text-gray-600 font-medium">
                          {totalAttempts}
                        </td>
                        <td className="text-center py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${passed ? "bg-green-50 border border-green-200 text-green-600" : "bg-yellow-50 border border-yellow-200 text-yellow-600"}`}
                          >
                            {passed ? "✅ Passed" : "📚 Improving"}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/performance/${encodeURIComponent(course.courseId)}`,
                              )
                            }
                            className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Attempt History - Only show for single course view */}
        {!isOverallView && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaHistory className="text-blue-600" />
              Attempt History
            </h3>
            <div className="space-y-3">
              {currentAttempts.map((attempt, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAttempt(attempt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAttempt?.attemptId === attempt.attemptId ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
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
                        </div>
                        <div className="text-gray-500 text-sm">
                          {attempt.attemptDate
                            ? new Date(attempt.attemptDate).toLocaleString()
                            : "Recent"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${attempt.passed ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}
                      >
                        {attempt.passed ? "PASSED" : "FAILED"}
                      </span>
                      {selectedAttempt?.attemptId === attempt.attemptId && (
                        <FaCheckCircle className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Question Analysis - Only show for single course view */}
        {!isOverallView &&
          selectedAttempt &&
          selectedAttempt.answers &&
          selectedAttempt.answers.length > 0 && (
            <div
              id="question-analysis"
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-12 scroll-mt-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBrain className="text-blue-600" />
                Question Analysis - Attempt #{selectedAttempt.attemptNumber}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FaThumbsUp className="text-green-600 text-xl" />
                    <span className="text-green-600 font-bold">
                      Correct Answers
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {selectedAttempt.answers.filter((a) => a.isCorrect).length}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    of {selectedAttempt.answers.length} total
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FaThumbsDown className="text-red-600 text-xl" />
                    <span className="text-red-600 font-bold">
                      Incorrect Answers
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {selectedAttempt.answers.filter((a) => !a.isCorrect).length}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    of {selectedAttempt.answers.length} total
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedAttempt.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div
                      onClick={() => toggleQuestionExpansion(index)}
                      className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${answer.isCorrect ? "bg-green-50" : "bg-red-50"}`}
                          >
                            {answer.isCorrect ? (
                              <FaCheckCircle className="text-green-600 text-sm" />
                            ) : (
                              <FaTimesCircle className="text-red-600 text-sm" />
                            )}
                          </div>
                          <span className="text-gray-900 font-medium">
                            Question {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}
                          >
                            {answer.isCorrect ? "Correct" : "Incorrect"}
                          </span>
                          <span className="text-gray-400">
                            {expandedQuestions.has(index) ? "−" : "+"}
                          </span>
                        </div>
                      </div>
                      {!expandedQuestions.has(index) && (
                        <div className="mt-3 text-sm text-gray-600 pl-12">
                          <p className="truncate max-w-2xl">
                            {answer.question}
                          </p>
                        </div>
                      )}
                    </div>

                    {expandedQuestions.has(index) && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <div className="pt-4 space-y-4">
                          <div>
                            <p className="text-gray-600 text-sm mb-2 font-medium">
                              Question:
                            </p>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {answer.question}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                            <p className="text-xs uppercase font-bold text-gray-600 mb-2">
                              Your Answer
                            </p>
                            <p className="text-gray-900 font-semibold text-lg">
                              {answer.selectedOption !== null &&
                              answer.selectedOption !== undefined
                                ? answer.options &&
                                  answer.options[answer.selectedOption]
                                  ? `${String.fromCharCode(65 + answer.selectedOption)}. ${answer.options[answer.selectedOption]}`
                                  : `Option ${String.fromCharCode(65 + answer.selectedOption)}`
                                : "Not answered"}
                            </p>
                            <p
                              className={`text-sm mt-2 font-bold ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}
                            >
                              {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600 text-sm font-medium">
                              All Options:
                            </p>
                            <div className="space-y-2">
                              {answer.options && answer.options.length > 0 ? (
                                answer.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-3 rounded-lg border ${optIndex === answer.selectedOption ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-900">
                                        {String.fromCharCode(65 + optIndex)}.{" "}
                                        {option}
                                      </span>
                                      {optIndex === answer.selectedOption && (
                                        <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">
                                          YOUR ANSWER
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-600 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  Options not available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Performance;
