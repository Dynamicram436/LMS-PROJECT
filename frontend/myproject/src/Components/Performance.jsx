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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isOverallView = category === "overall";

  console.log("Performance component - User from localStorage:", user);
  console.log("Performance component - User ID:", user?.userid);
  console.log("Performance component - Category:", category);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!user?.userid) {
        toast.error("User not logged in");
        navigate("/home");
        return;
      }

      console.log("User data:", user);
      console.log("User ID:", user.userid);
      console.log("Current URL:", window.location.href);
      console.log("Category param:", category);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam/results/${user.userid}`
        );

        console.log("API Response:", response.data);
        console.log("Is Overall View:", isOverallView);
        console.log("Subject:", subject);
        console.log("Response data type:", typeof response.data.data);
        console.log("Is array:", Array.isArray(response.data.data));

        if (response.data.success && Array.isArray(response.data.data)) {
          console.log("Exam data array:", response.data.data);
          console.log("Array length:", response.data.data.length);

          // Log each item in the array with detailed answer structure
          response.data.data.forEach((item, index) => {
            console.log(`Item ${index}:`, item);
            console.log(`Item ${index} courseId:`, item.courseId);
            console.log(`Item ${index} courseName:`, item.courseName);
            console.log(`Item ${index} examAttempts:`, item.examAttempts);
            
            // Log detailed answer structure for first attempt
            if (item.examAttempts && item.examAttempts.length > 0) {
              const firstAttempt = item.examAttempts[0];
              console.log(`Item ${index} First attempt answers:`, firstAttempt.answers);
              if (firstAttempt.answers && firstAttempt.answers.length > 0) {
                console.log(`Item ${index} First answer structure:`, firstAttempt.answers[0]);
                console.log(`Item ${index} First answer options:`, firstAttempt.answers[0].options);
                console.log(`Item ${index} First answer question:`, firstAttempt.answers[0].question);
              }
            }
          });

          setAllExamData(response.data.data);

          if (isOverallView) {
            // For overall view, show all courses
            if (response.data.data.length > 0) {
              console.log("Setting first course for overall view");
              setSelectedCourse(response.data.data[0]);
              setExamData(response.data.data[0]);
              // Set first attempt if available
              if (
                response.data.data[0].examAttempts &&
                response.data.data[0].examAttempts.length > 0
              ) {
                setSelectedAttempt(response.data.data[0].examAttempts[0]);
              }
            } else {
              console.log("No exam data found for overall view");
            }
          } else {
            // For specific course view
            // Match courses where courseId starts with subject (for chapter-based courses)
            // or exact match, or courseName matches
            const subjectStr = String(subject || "").trim();

            console.log("Looking for course with ID/Name:", subjectStr);
            console.log(
              "All available courses:",
              response.data.data.map((r) => ({
                courseId: r.courseId,
                courseName: r.courseName,
                examAttemptsCount: r.examAttempts?.length || 0,
              }))
            );

            const courseData = response.data.data.find((result) => {
              const courseIdStr = String(result.courseId || "").trim();
              const courseNameStr = String(result.courseName || "").trim();

              // Exact match (case-insensitive)
              if (
                courseIdStr.toLowerCase() === subjectStr.toLowerCase() ||
                courseNameStr.toLowerCase() === subjectStr.toLowerCase()
              ) {
                console.log("Exact match found:", {
                  courseIdStr,
                  courseNameStr,
                  subjectStr,
                });
                return true;
              }

              // Check if courseId starts with subject (for chapter-based courses like "Mathematics-chapter-1")
              // Handle both "-chapter-" and "-" separators
              if (
                courseIdStr
                  .toLowerCase()
                  .startsWith(subjectStr.toLowerCase() + "-") ||
                courseIdStr
                  .toLowerCase()
                  .startsWith(subjectStr.toLowerCase() + "_")
              ) {
                console.log("Prefix match found:", { courseIdStr, subjectStr });
                return true;
              }

              // Check if courseName contains the subject (case-insensitive)
              if (
                courseNameStr
                  .toLowerCase()
                  .includes(subjectStr.toLowerCase()) ||
                subjectStr.toLowerCase().includes(courseNameStr.toLowerCase())
              ) {
                console.log("Name contains match found:", {
                  courseNameStr,
                  subjectStr,
                });
                return true;
              }

              return false;
            });

            console.log("Found course data:", courseData);

            if (courseData) {
              setExamData(courseData);
              if (
                courseData.examAttempts &&
                courseData.examAttempts.length > 0
              ) {
                setSelectedAttempt(courseData.examAttempts[0]);
              }
            } else {
              console.log("No matching course found. Subject:", subjectStr);
              console.log("Available courses:", response.data.data);
              // Don't show toast here, let the component show the "No Performance Data" message
            }
          }
        } else {
          console.log("API response structure invalid:", response.data);
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
      firstHalf.reduce((sum, a) => sum + (a.score || 0), 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, a) => sum + (a.score || 0), 0) /
      secondHalf.length;

    const change = secondAvg - firstAvg;

    if (change > 5) return { trend: "up", change: Math.round(change) };
    if (change < -5) return { trend: "down", change: Math.round(change) };
    return { trend: "neutral", change: 0 };
  };

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

  if (!examData) {
    console.log("No examData found - showing No Performance Data");
    console.log("examData value:", examData);
    console.log("allExamData:", allExamData);
    console.log("isOverallView:", isOverallView);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Performance Data
          </h2>
          <p className="text-gray-500 mb-6">
            {isOverallView
              ? "You haven't attempted any exams yet."
              : "You haven't attempted any exams for this course yet."}
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

  const performanceLevel = getPerformanceLevel(examData.score || 0);
  const streakInfo = getStreakInfo(examData.examAttempts || []);
  const improvementTrend = getImprovementTrend(examData.examAttempts || []);
  const PerformanceIcon = performanceLevel.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-8 cursor-pointer z-50 flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full transition-colors duration-200 shadow-sm"
      >
        <FaArrowLeft />
        <span className="font-bold text-sm">Back</span>
      </button>

      <div className="max-w-6xl mx-auto relative z-10 mt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isOverallView ? "Overall Performance" : "Performance Analytics"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isOverallView
              ? "All Courses Performance"
              : `${subject} - Detailed Exam Results`}
          </p>
        </div>

        {/* Course Selector for Overall View */}
        {isOverallView && allExamData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Course</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allExamData.map((course, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCourse(course);
                    setExamData(course);
                    if (course.examAttempts && course.examAttempts.length > 0) {
                      setSelectedAttempt(course.examAttempts[0]);
                    } else {
                      setSelectedAttempt(null);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedCourse === course
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-gray-900 font-bold mb-2">
                    {course.courseName || course.courseId || "Unknown Course"}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {course.examAttempts ? course.examAttempts.length : 0}{" "}
                    attempts • {course.score || 0}% avg
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Overall Score */}
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
              {examData.score}%
            </div>
            <div className="text-gray-500 text-sm">Overall Score</div>
          </div>

          {/* Total Attempts */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <FaHistory className="text-3xl text-blue-600" />
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                Active
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {examData.examAttempts ? examData.examAttempts.length : 0}
            </div>
            <div className="text-gray-500 text-sm">Total Attempts</div>
          </div>

          {/* Current Streak */}
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

          {/* Best Streak */}
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

        {/* Improvement Trend */}
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

        {/* Attempt History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaHistory className="text-blue-600" />
            Attempt History
          </h3>
          <div className="space-y-3">
            {examData.examAttempts &&
              examData.examAttempts.map((attempt, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAttempt(attempt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedAttempt === attempt
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">
                          #{attempt.attemptNumber || index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold">
                          {attempt.score || 0}%
                        </div>
                        <div className="text-gray-500 text-sm">
                          {attempt.attemptDate
                            ? new Date(attempt.attemptDate).toLocaleDateString()
                            : "Recent"}
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
                        {attempt.passed ? "PASSED" : "FAILED"}
                      </span>
                      {selectedAttempt === attempt && (
                        <FaCheckCircle className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Detailed Question Analysis */}
        {selectedAttempt &&
          selectedAttempt.answers &&
          selectedAttempt.answers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
                    {selectedAttempt.answers
                      ? selectedAttempt.answers.filter((a) => a.isCorrect)
                          .length
                      : 0}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    of {selectedAttempt.answers ? selectedAttempt.answers.length : 0} total
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
                    {selectedAttempt.answers
                      ? selectedAttempt.answers.filter((a) => !a.isCorrect)
                          .length
                      : 0}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    of {selectedAttempt.answers ? selectedAttempt.answers.length : 0} total
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedAttempt.answers &&
                  selectedAttempt.answers.map((answer, index) => {
                    console.log(`Rendering answer ${index}:`, answer);
                    console.log(`Answer ${index} options:`, answer.options);
                    console.log(`Answer ${index} selectedOption:`, answer.selectedOption);
                    console.log(`Answer ${index} correctAnswer:`, answer.correctAnswer);
                    
                    return (
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
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                answer.isCorrect
                                  ? "bg-green-50"
                                  : "bg-red-50"
                              }`}
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
                              className={`text-sm font-bold ${
                                answer.isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {answer.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                            <span className="text-gray-400">
                              {expandedQuestions.has(index) ? "−" : "+"}
                            </span>
                          </div>
                        </div>
                        {/* Show question preview when collapsed */}
                        {!expandedQuestions.has(index) && (
                          <div className="mt-3 text-sm text-gray-600 pl-12">
                            <p className="truncate max-w-2xl">{answer.question}</p>
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

                            {/* Your answer only */}
                            <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                              <p className="text-xs uppercase font-bold text-gray-600 mb-2">
                                Your Answer
                              </p>
                              <p className="text-gray-900 font-semibold text-lg">
                                {answer.selectedOption !== null &&
                                answer.selectedOption !== undefined
                                  ? answer.options && answer.options[answer.selectedOption]
                                    ? `${String.fromCharCode(65 + answer.selectedOption)}. ${answer.options[answer.selectedOption]}`
                                    : `Option ${String.fromCharCode(65 + answer.selectedOption)}`
                                  : "Not answered"}
                              </p>
                              <p
                                className={`text-sm mt-2 font-bold ${
                                  answer.isCorrect
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <p className="text-gray-600 text-sm font-medium">All Options:</p>
                              <div className="space-y-2">
                                {answer.options && answer.options.length > 0 ? (
                                  answer.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`p-3 rounded-lg border ${
                                        optIndex === answer.selectedOption
                                          ? "bg-blue-50 border-blue-300"
                                          : "bg-white border-gray-200"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-900">{String.fromCharCode(65 + optIndex)}. {option}</span>
                                        <div className="flex items-center gap-2">
                                          {optIndex === answer.selectedOption && (
                                            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">
                                              YOUR ANSWER
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-gray-600 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    Options not available for this question
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Performance;
