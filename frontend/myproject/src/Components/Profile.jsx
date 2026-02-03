import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaBook,
  FaChartLine,
  FaStar,
  FaMedal,
  FaAward,
  FaCrown,
  FaBookOpen,
  FaTasks,
  FaCheckCircle,
  FaRegClock,
  FaUserGraduate,
  FaCalendarAlt,
  FaIdCard,
  FaChartBar,
  FaGlobe,
  FaBuilding,
  FaPlay,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ProgressService from "../utils/ProgressService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
  });

  // Function to refresh progress data
  const refreshProgressData = async () => {
    if (!user?.userid) return;

    try {
      const progressData = await ProgressService.getUserProgress(user.userid);
      console.log("Refresh progress data received:", progressData);

      if (progressData.success && Array.isArray(progressData.data)) {
        const updatedUserData = {
          ...user,
          examResults: progressData.data,
        };
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Force re-render by updating state
        setUser((prev) => ({ ...prev, examResults: progressData.data }));
        console.log("Successfully refreshed progress data");
      } else {
        console.log("No valid progress data received during refresh");
      }
    } catch (error) {
      console.error("Error refreshing progress:", error);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);

        // Set initial user data immediately
        setUser({
          ...userData,
          examResults: Array.isArray(userData.examResults)
            ? userData.examResults
            : [],
        });
        setEditForm({
          name: userData.name || "",
        });

        // Fetch and update progress data
        if (userData.userid) {
          try {
            console.log(
              "Fetching fresh progress data for user:",
              userData.userid
            );
            const progressData = await ProgressService.getUserProgress(
              userData.userid
            );
            console.log("Progress data received:", progressData);

            if (progressData.success && Array.isArray(progressData.data)) {
              // Update user data with latest progress
              const updatedUserData = {
                ...userData,
                examResults: progressData.data,
              };
              setUser(updatedUserData);
              localStorage.setItem("user", JSON.stringify(updatedUserData));
              console.log("Updated user with exam results:", progressData.data);
            } else {
              console.log(
                "No valid progress data received, using existing data"
              );
              // Use existing examResults if available
              const existingResults = Array.isArray(userData.examResults)
                ? userData.examResults
                : [];
              setUser((prev) => ({
                ...prev,
                examResults: existingResults,
              }));
            }
          } catch (error) {
            console.error("Error fetching progress:", error);
            // Fallback to existing data
            const existingResults = Array.isArray(userData.examResults)
              ? userData.examResults
              : [];
            setUser((prev) => ({
              ...prev,
              examResults: existingResults,
            }));
          }
        }
      } else {
        toast.error("User data not found. Please log in.");
      }
      setLoading(false);
    };

    initializeProfile();
  }, []); // Remove user?.userid dependency to prevent re-running unnecessarily

  // Separate useEffect for event listeners
  useEffect(() => {
    // Listen for real-time progress updates
    const handleProgressUpdate = (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (String(currentUser?.userid) === String(event.detail.userId)) {
        refreshProgressData();
      }
    };

    // Listen for exam submissions
    const handleExamSubmission = async (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (String(currentUser?.userid) === String(event.detail.userId)) {
        console.log(
          "Profile: Exam submission detected, refreshing data...",
          event.detail
        );

        // Update local user data with the new exam result
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          // Initialize examResults if not present
          if (!Array.isArray(userData.examResults)) {
            userData.examResults = [];
          }

          // Find if this course already exists in the results
          const existingCourseIndex = userData.examResults.findIndex(
            (course) =>
              String(course.courseId).trim().toLowerCase() ===
              String(event.detail.courseId).trim().toLowerCase()
          );

          const newExamAttempt = {
            score: event.detail.score,
            passed: event.detail.passed,
            attemptDate: new Date().toISOString(),
            attemptNumber:
              (existingCourseIndex >= 0
                ? userData.examResults[existingCourseIndex]?.examAttempts
                    ?.length || 0
                : 0) + 1,
            answers: event.detail.result?.answers || [],
          };

          if (existingCourseIndex >= 0) {
            // Update existing course with guard to avoid duplicate processing
            const courseEntry = userData.examResults[existingCourseIndex];
            const existingAttempts = courseEntry.examAttempts || [];
            const alreadyExists = existingAttempts.some(
              (a) => a.attemptDate === newExamAttempt.attemptDate
            );
            if (!alreadyExists) {
              courseEntry.examAttempts = existingAttempts.concat([
                newExamAttempt,
              ]);
              courseEntry.score = event.detail.score;
              courseEntry.passed = event.detail.passed;
              courseEntry.lastAttempt = newExamAttempt.attemptDate;
            }
          } else {
            // Add new course entry if not already present (guard against duplicates)
            const exists = userData.examResults.find(
              (c) =>
                String(c.courseId).trim().toLowerCase() ===
                String(event.detail.courseId).trim().toLowerCase()
            );
            if (!exists) {
              userData.examResults.push({
                courseId: event.detail.courseId,
                courseName: event.detail.courseId, // Will be updated with proper name later
                score: event.detail.score,
                passed: event.detail.passed,
                examAttempts: [newExamAttempt],
                lastAttempt: newExamAttempt.attemptDate,
                completionPercentage: event.detail.passed ? 100 : 0,
              });
            }
          }

          // Update localStorage first
          localStorage.setItem("user", JSON.stringify(userData));

          // Update component state immediately for instant UI update
          setUser((prev) => ({
            ...prev,
            examResults: userData.examResults,
          }));
        }

        // Then refresh progress data from server with a small delay to ensure backend has processed
        setTimeout(async () => {
          await refreshProgressData();
        }, 500);
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    window.addEventListener("examSubmitted", handleExamSubmission);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
      window.removeEventListener("examSubmitted", handleExamSubmission);
    };
  }, []); // Empty dependency array since handlers use fresh data from localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...editForm,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const markCourseComplete = async (courseId) => {
    if (!user?.userid || !courseId) {
      toast.error("User or course information is missing");
      return;
    }

    try {
      // Update video progress to 100% to mark the course as complete
      const result = await ProgressService.updateVideoProgress(
        user.userid,
        courseId,
        `exam_${courseId}`, // Using exam video ID to represent course completion
        true,
        100 // Set completion percentage to 100%
      );

      if (result.success) {
        toast.success("Course marked as 100% complete!");

        // Immediately update local state
        const updatedUserData = {
          ...user,
          examResults: (user.examResults || []).map((course) =>
            course.courseId === courseId
              ? { ...course, completionPercentage: 100 }
              : course
          ),
        };

        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Dispatch event to update other components immediately
        window.dispatchEvent(
          new CustomEvent("progressUpdated", {
            detail: {
              userId: user.userid,
              courseId: courseId,
              completionPercentage: 100,
            },
          })
        );

        // Force refresh progress data from server
        setTimeout(() => {
          refreshProgressData();
        }, 500);
      } else {
        toast.error(result.message || "Failed to mark course as complete");
      }
    } catch (error) {
      console.error("Error marking course as complete:", error);
      toast.error("Failed to mark course as complete");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUserGraduate className="text-xl text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading your Profile...</p>
        </div>
      </div>
    );
  }

  const examResults = Array.isArray(user.examResults) ? user.examResults : [];

  // Debug: Log exam data to understand structure
  console.log("Profile Component Debug:");
  console.log("User data:", user);
  console.log("Exam results:", examResults);
  console.log("User examResults type:", typeof user.examResults);
  console.log("Is examResults array?", Array.isArray(user.examResults));
  const totalAttempts = examResults.reduce(
    (sum, course) => sum + (course.examAttempts?.length || 0),
    0
  );
  const coursesStarted = examResults.length;
  const completedCourses = examResults.filter(
    (course) => (course.completionPercentage || 0) >= 100
  ).length;
  const overallScore =
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

  // Calculate average progress across all courses
  const averageProgress =
    coursesStarted > 0
      ? Math.round(
          examResults.reduce(
            (sum, course) => sum + (course.completionPercentage || 0),
            0
          ) / coursesStarted
        )
      : 0;

  // Determine achievement level based on performance
  const getAchievementLevel = () => {
    if (overallScore >= 90)
      return {
        level: "Master",
        icon: <FaCrown className="text-yellow-500 text-lg" />,
        color: "from-yellow-400 to-yellow-600",
        badge: "Expert Level",
      };
    if (overallScore >= 75)
      return {
        level: "Expert",
        icon: <FaMedal className="text-blue-500 text-lg" />,
        color: "from-blue-400 to-blue-600",
        badge: "Advanced Level",
      };
    if (overallScore >= 60)
      return {
        level: "Advanced",
        icon: <FaAward className="text-purple-500 text-lg" />,
        color: "from-purple-400 to-purple-600",
        badge: "Intermediate Level",
      };
    return {
      level: "Beginner",
      icon: <FaStar className="text-green-500 text-lg" />,
      color: "from-green-400 to-green-600",
      badge: "Starter Level",
    };
  };

  const achievement = getAchievementLevel();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional College Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                <FaUserGraduate className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Profile
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
              >
                <FaEdit className="text-sm" />
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                      <FaUserGraduate className="text-4xl text-white" />
                    </div>
                    <div className="absolute bottom-0 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <FaIdCard className="text-xs" />
                    <span>Student ID: {user.userid}</span>
                  </div>

                  {/* Achievement Badge */}
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                    {achievement.icon}
                    <span>{achievement.level} Learner</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <div className="p-2.5 bg-blue-50 rounded-lg">
                      <FaCalendarAlt className="text-blue-600 text-base" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Member Since
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <div className="p-2.5 bg-indigo-50 rounded-lg">
                      <FaBuilding className="text-indigo-600 text-base" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Institution
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {import.meta.env.VITE_REACT_APP_INSTITUTION_NAME ||
                          "Academic Institution"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-green-50 rounded-lg">
                      <FaGlobe className="text-green-600 text-base" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Status
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Active Student
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaChartBar className="text-blue-600 text-lg" />
                </div>
                Academic Progress
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 font-semibold">
                      Average Progress
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {averageProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${averageProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 font-semibold">
                      Overall Performance
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {overallScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${overallScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-700">
                      {completedCourses}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">
                      Completed
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center border border-indigo-100">
                    <p className="text-2xl font-bold text-indigo-700">
                      {coursesStarted - completedCourses}
                    </p>
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      In Progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-sm p-6 text-white border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold">
                      Courses Enrolled
                    </p>
                    <p className="text-3xl font-bold mt-1">{coursesStarted}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaBookOpen className="text-white text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-sm p-6 text-white border border-indigo-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-semibold">
                      Exams Taken
                    </p>
                    <p className="text-3xl font-bold mt-1">{totalAttempts}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaTasks className="text-white text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-sm p-6 text-white border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-semibold">
                      Courses Completed
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {completedCourses}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-sm p-6 text-white border border-amber-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-semibold">
                      Average Score
                    </p>
                    <p className="text-3xl font-bold mt-1">{overallScore}%</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            {editing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaEdit className="text-blue-600 text-lg" />
                  </div>
                  Update Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={user.userid}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 font-medium"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaRegClock className="text-indigo-600 text-lg" />
                  </div>
                  Recent Academic Activity
                </h3>
                <button
                  onClick={refreshProgressData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <FaClock className="text-sm" />
                  Refresh Data
                </button>
              </div>

              <div className="space-y-4">
                {examResults && examResults.length > 0 ? (
                  examResults.slice(0, 3).map((course, index) => {
                    const completionPercentage =
                      course.completionPercentage !== undefined &&
                      course.completionPercentage !== null
                        ? Math.max(
                            0,
                            Math.min(100, course.completionPercentage)
                          )
                        : 0;

                    let completionStatus = "In Progress";
                    let statusColor = "bg-gray-100 text-gray-700";
                    let statusBg = "bg-gray-50";

                    if (completionPercentage >= 100) {
                      completionStatus = "Completed";
                      statusColor = "bg-green-100 text-green-700";
                      statusBg = "bg-green-50";
                    } else if (completionPercentage >= 75) {
                      completionStatus = "Almost Done";
                      statusColor = "bg-blue-100 text-blue-700";
                      statusBg = "bg-blue-50";
                    } else if (completionPercentage >= 50) {
                      completionStatus = "Halfway There";
                      statusColor = "bg-indigo-100 text-indigo-700";
                      statusBg = "bg-indigo-50";
                    } else if (completionPercentage >= 25) {
                      completionStatus = "Making Progress";
                      statusColor = "bg-amber-100 text-amber-700";
                      statusBg = "bg-amber-50";
                    } else if (completionPercentage >= 1) {
                      completionStatus = "Just Started";
                      statusColor = "bg-orange-100 text-orange-700";
                      statusBg = "bg-orange-50";
                    } else {
                      completionStatus = "Not Started";
                      statusColor = "bg-gray-100 text-gray-700";
                      statusBg = "bg-gray-50";
                    }

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 ${statusBg} rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200`}
                      >
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                          <FaBook className="text-gray-700 text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">
                            {course.courseName ||
                              course.courseId ||
                              `Course ${index + 1}`}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Progress: {completionPercentage}%</span>
                            {course.examAttempts &&
                              course.examAttempts.length > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span>
                                    {course.examAttempts.length} attempt
                                    {course.examAttempts.length > 1 ? "s" : ""}
                                  </span>
                                </>
                              )}
                          </div>
                          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ease-out ${
                                completionPercentage >= 100
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                  : completionPercentage >= 75
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                  : completionPercentage >= 50
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                  : "bg-gradient-to-r from-gray-300 to-gray-400"
                              }`}
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor} mb-2 border`}
                          >
                            {completionStatus}
                          </span>
                          {completionPercentage >= 1 &&
                            completionPercentage < 100 && (
                              <button
                                onClick={() =>
                                  markCourseComplete(course.courseId)
                                }
                                className="block w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-sm"
                              >
                                Mark Complete
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaBook className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No Academic Activity Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start your academic journey by enrolling in your first
                      course.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/courses")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-sm"
                    >
                      <FaPlay className="text-sm" />
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
