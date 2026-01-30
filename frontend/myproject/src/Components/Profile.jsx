import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaGraduationCap,
  FaTrophy,
  FaEdit,
  FaBook,
  FaChartLine,
  FaCertificate,
  FaClock,
  FaStar,
  FaMedal,
  FaAward,
  FaCrown,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
  });

  useEffect(() => {
    const initializeProfile = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
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
  }, []);

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <FaUserCircle className="text-3xl text-blue-500 animate-bounce" />
            </div>
          </div>
          <p className="text-gray-600 animate-pulse font-medium text-lg">
            Loading your learning dashboard...
          </p>
        </div>
      </div>
    );
  }

  const examResults = user.examResults || [];
  const totalAttempts = examResults.reduce(
    (sum, course) => sum + (course.examAttempts?.length || 0),
    0
  );
  const coursesStarted = examResults.length;
  const passedCourses = examResults.filter((course) =>
    course.examAttempts?.some((attempt) => attempt.passed)
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

  // Determine achievement level based on performance
  const getAchievementLevel = () => {
    if (overallScore >= 90)
      return {
        level: "Master",
        icon: <FaCrown className="text-yellow-500" />,
        color: "from-yellow-400 to-yellow-600",
      };
    if (overallScore >= 75)
      return {
        level: "Expert",
        icon: <FaMedal className="text-blue-500" />,
        color: "from-blue-400 to-blue-600",
      };
    if (overallScore >= 60)
      return {
        level: "Advanced",
        icon: <FaAward className="text-purple-500" />,
        color: "from-purple-400 to-purple-600",
      };
    return {
      level: "Beginner",
      icon: <FaStar className="text-green-500" />,
      color: "from-green-400 to-green-600",
    };
  };

  const achievement = getAchievementLevel();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Enhanced Profile Header with Gradient */}
        <div className="relative h-48 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative p-1 bg-white rounded-full border-4 border-white shadow-2xl">
                <div className="w-32 h-32 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white">
                  <FaUserCircle className="text-6xl text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-6">
            <button
              onClick={() => setEditing(!editing)}
              className="px-5 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg border border-white/30"
            >
              <FaEdit size={16} />
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="pt-20 px-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 bg-linear-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold uppercase tracking-wider rounded-full border border-blue-300 shadow-sm">
                  <FaGraduationCap className="inline mr-2" size={12} />
                  Student
                </span>
                <span className="px-4 py-2 bg-linear-to-r from-purple-100 to-purple-200 text-purple-800 text-sm font-bold uppercase tracking-wider rounded-full border border-purple-300 shadow-sm">
                  <FaClock className="inline mr-2" size={12} />
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : new Date().getFullYear()}
                </span>
                <span
                  className={`px-4 py-2 bg-linear-to-r ${achievement.color} text-white text-sm font-bold uppercase tracking-wider rounded-full border border-white/30 shadow-sm flex items-center gap-2`}
                >
                  {achievement.icon}
                  {achievement.level} Learner
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form when editing */}
          {editing && (
            <div className="mt-6 p-8 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaEdit className="text-blue-600" size={20} />
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
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Stats Grid with Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-500 rounded-2xl shadow-lg">
                  <FaBook className="text-2xl text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Courses
                  </span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {coursesStarted}
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600 font-medium">Enrolled</div>
            </div>

            <div className="p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-purple-500 rounded-2xl shadow-lg">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Exams
                  </span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {totalAttempts}
                  </div>
                </div>
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Attempts
              </div>
            </div>

            <div className="p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-green-500 rounded-2xl shadow-lg">
                  <FaCertificate className="text-2xl text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                    Completed
                  </span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {passedCourses}
                  </div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">Passed</div>
            </div>

            <div className="p-6 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-amber-500 rounded-2xl shadow-lg">
                  <FaChartLine className="text-2xl text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Average
                  </span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {overallScore}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-amber-600 font-medium">Score</div>
            </div>
          </div>

          {/* Enhanced Personal Information Section */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl">
                <FaUserCircle className="text-white" size={24} />
              </div>
              Learning Profile
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaUserCircle className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    Full Name
                  </span>
                </div>
                <p className="text-gray-900 font-semibold text-xl">
                  {user.name}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaClock className="text-purple-600 text-lg" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    Member Since
                  </span>
                </div>
                <p className="text-gray-900 font-semibold text-xl">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Enhanced Account Details */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-green-500 to-teal-500 rounded-lg">
                  <FaGraduationCap className="text-white" size={18} />
                </div>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FaCertificate className="text-gray-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        Student ID
                      </span>
                    </div>
                    <span className="text-sm font-mono text-gray-800 bg-linear-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-lg font-bold shadow-sm">
                      {user.userid}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaStar className="text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        Learning Status
                      </span>
                    </div>
                    <span className="text-sm text-green-700 bg-linear-to-r from-green-100 to-green-200 px-4 py-2 rounded-lg font-bold shadow-sm">
                      Active Learner
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
