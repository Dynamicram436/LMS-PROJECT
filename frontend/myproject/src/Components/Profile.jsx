import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaGraduationCap,
  FaTrophy,
  FaCalendarAlt,
  FaEdit,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-slate-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-slate-400/50 animate-pulse font-medium">
            Loading profile...
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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Profile Header */}
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="p-1 bg-white rounded-full border-4 border-white shadow-lg">
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200">
                <FaUserCircle className="text-7xl text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider rounded-full">
                  Student
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-full">
                  Member since{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : new Date().getFullYear()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(!editing)}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <FaEdit />
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Form when editing */}
          {editing && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3 text-blue-600">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaGraduationCap className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Courses
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {coursesStarted}
              </div>
              <div className="text-xs text-gray-600 mt-1">Enrolled</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3 text-green-600">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaTrophy className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Exams
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {totalAttempts}
              </div>
              <div className="text-xs text-gray-600 mt-1">Attempts</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3 text-purple-600">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Progress
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {passedCourses}
              </div>
              <div className="text-xs text-gray-600 mt-1">Completed</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-3 text-yellow-600">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaGraduationCap className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Score
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {overallScore}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Average</div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2 text-gray-600">
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Full Name
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-md font-bold text-gray-900 mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">User Identifier</span>
                  <span className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">
                    {user.userid}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-800">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
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
