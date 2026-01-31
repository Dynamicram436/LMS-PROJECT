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

        // Fetch and update progress data
        if (userData.userid) {
          try {
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
              if (userData.examResults) {
                setUser({
                  ...userData,
                  examResults: Array.isArray(userData.examResults)
                    ? userData.examResults
                    : [],
                });
              }
            }
          } catch (error) {
            console.error("Error fetching progress:", error);
            // Fallback to existing data
            if (userData.examResults) {
              setUser({
                ...userData,
                examResults: Array.isArray(userData.examResults)
                  ? userData.examResults
                  : [],
              });
            }
          }
        }

        setUser(userData);
        setEditForm({
          name: userData.name || "",
        });
      } else {
        toast.error("User data not found. Please log in.");
      }
      setLoading(false);
    };

    initializeProfile();

    // Listen for real-time progress updates
    const handleProgressUpdate = (event) => {
      if (event.detail.userId === user?.userid) {
        refreshProgressData();
      }
    };

    // Listen for exam submissions
    const handleExamSubmission = (event) => {
      if (event.detail.userId === user?.userid) {
        refreshProgressData();
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    window.addEventListener("examSubmitted", handleExamSubmission);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
      window.removeEventListener("examSubmitted", handleExamSubmission);
    };
  }, [user?.userid]); // Add user.userid to dependencies

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
              <FaUserGraduate className="text-4xl text-blue-600 animate-bounce" />
            </div>
          </div>
          <p className="text-gray-600 animate-pulse font-medium text-lg">
            Loading your Profile...
          </p>
        </div>
      </div>
    );
  }

  const examResults = Array.isArray(user.examResults) ? user.examResults : [];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Learning Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <FaEdit className="text-base" />
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white"></div>
                  <div className="absolute top-8 right-6 w-6 h-6 rounded-full bg-white"></div>
                  <div className="absolute bottom-6 left-8 w-4 h-4 rounded-full bg-white"></div>
                </div>

                <div className="relative mx-auto w-28 h-28 mb-4">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-30 scale-110"></div>

                  {/* Main profile container */}
                  <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-full p-2 shadow-xl border-4 border-white/20">
                    {/* Inner decorative ring */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300/50 animate-spin"
                      style={{ animationDuration: "20s" }}
                    ></div>

                    {/* Profile icon with enhanced styling */}
                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-full h-full flex items-center justify-center shadow-inner">
                      <FaUserGraduate className="text-5xl text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 text-blue-100 mt-2">
                  <FaIdCard className="text-base" />
                  <span className="font-mono text-sm tracking-wide">
                    {user.userid}
                  </span>
                </div>

                {/* Achievement Badge */}
                <div
                  className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${achievement.color} text-white text-sm font-semibold`}
                >
                  {achievement.icon}
                  {achievement.level} Learner
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-gray-500 text-lg" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaBuilding className="text-gray-500 text-lg" />
                    <div>
                      <p className="text-sm text-gray-600">Institution</p>
                      <p className="font-medium">Online Learning Platform</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaGlobe className="text-gray-500 text-lg" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-green-600">
                        Active Learner
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartBar className="text-blue-600 text-lg" />
                Learning Progress Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Average Course Progress
                    </span>
                    <span className="font-medium">{averageProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${averageProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Performance</span>
                    <span className="font-medium">{overallScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Courses Enrolled</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {coursesStarted}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaBookOpen className="text-blue-600 text-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Exams Taken</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {totalAttempts}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaTasks className="text-purple-600 text-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Courses Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {completedCourses}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {overallScore}%
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <FaChartLine className="text-amber-600 text-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            {editing && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaEdit className="text-blue-600 text-lg" />
                  </div>
                  Update Your Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={user.userid}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FaRegClock className="text-indigo-600 text-lg" />
                </div>
                Recent Learning Activity
              </h3>
              <div className="space-y-4">
                {examResults && examResults.length > 0 ? (
                  examResults.slice(0, 3).map((course, index) => {
                    // Calculate course completion percentage with better fallbacks
                    const completionPercentage =
                      course.completionPercentage !== undefined &&
                      course.completionPercentage !== null
                        ? Math.max(
                            0,
                            Math.min(100, course.completionPercentage)
                          )
                        : 0;

                    // Determine completion status based on percentage
                    let completionStatus = "In Progress";
                    let statusColor = "bg-gray-100 text-gray-800";

                    if (completionPercentage >= 100) {
                      completionStatus = "100% Complete";
                      statusColor = "bg-green-100 text-green-800";
                    } else if (completionPercentage >= 75) {
                      completionStatus = "75% Complete";
                      statusColor = "bg-blue-200 text-blue-800";
                    } else if (completionPercentage >= 50) {
                      completionStatus = "50% Complete";
                      statusColor = "bg-blue-100 text-blue-800";
                    } else if (completionPercentage >= 25) {
                      completionStatus = "25% Complete";
                      statusColor = "bg-orange-100 text-orange-800";
                    } else if (completionPercentage >= 1) {
                      completionStatus = "1% Complete";
                      statusColor = "bg-yellow-100 text-yellow-800";
                    } else {
                      completionStatus = "Not Started";
                      statusColor = "bg-gray-100 text-gray-800";
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <FaBook className="text-gray-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {course.courseName ||
                              course.courseId ||
                              `Course ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Progress: {completionPercentage}%
                          </p>
                          {/* Debug info - remove in production */}
                          {import.meta.env.DEV && (
                            <p className="text-xs text-gray-400 mt-1">
                              Debug: completionPercentage=
                              {course.completionPercentage}, passed=
                              {course.passed ? "true" : "false"}
                            </p>
                          )}
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600">
                                {completionPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                          >
                            {completionStatus}
                          </span>
                          {completionPercentage >= 1 &&
                            completionPercentage < 100 && (
                              <button
                                onClick={() =>
                                  markCourseComplete(course.courseId)
                                }
                                className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                              >
                                Mark Complete
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <FaBook className="text-4xl mx-auto" />
                    </div>
                    <p className="text-gray-500">No learning activity yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start a course to see your progress
                    </p>
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
