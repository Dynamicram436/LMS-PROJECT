import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaGraduationCap,
  FaTrophy,
  FaCalendarAlt,
  FaEdit,
  FaBook,
  FaChartLine,
  FaCertificate,
  FaClock,
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
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-gray-600 animate-pulse font-medium">
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        {/* Enhanced Profile Header */}
        <div className="h-32 bg-gray-200 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="p-2 bg-white rounded-full border-4 border-white shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
                <FaUserCircle className="text-5xl text-gray-600" />
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all duration-200 flex items-center gap-2"
            >
              <FaEdit size={14} />
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-300">
                  <FaGraduationCap className="inline mr-1" size={10} />
                  Student
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-300">
                  <FaClock className="inline mr-1" size={10} />
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form when editing */}
          {editing && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaEdit className="text-gray-600" />
                Update Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-white"
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
                  className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3 text-gray-600">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FaBook className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Courses
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {coursesStarted}
              </div>
              <div className="text-xs text-gray-600">Enrolled</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3 text-gray-600">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FaTrophy className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Exams
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {totalAttempts}
              </div>
              <div className="text-xs text-gray-600">Attempts</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3 text-gray-600">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FaCertificate className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Completed
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {passedCourses}
              </div>
              <div className="text-xs text-gray-600">Passed</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3 text-gray-600">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FaChartLine className="text-xl" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Average
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {overallScore}%
              </div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
          </div>

          {/* Enhanced Personal Information Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaUserCircle className="text-gray-600" />
              Learning Profile
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3 text-gray-600">
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Full Name
                  </span>
                </div>
                <p className="text-gray-900 font-medium text-lg">{user.name}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3 text-gray-600">
                  <FaClock className="text-lg" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Member Since
                  </span>
                </div>
                <p className="text-gray-900 font-medium text-lg">
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
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-gray-600" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">
                      Student ID
                    </span>
                    <span className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded-lg font-bold">
                      {user.userid}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">
                      Learning Status
                    </span>
                    <span className="text-sm text-gray-800 bg-gray-100 px-3 py-1 rounded-lg font-bold">
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
