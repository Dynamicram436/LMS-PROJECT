import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBook,
  FiFilter,
  FiSearch,
  FiChevronRight,
  FiClock,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { subjectsData, categories } from "./courseCatalog";
import { Helmet } from "react-helmet-async";
import apiClient from "../utils/axiosConfig";

const Viewcourses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }

    const loadUserProgress = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.userid) {
        try {
          const response = await apiClient.get(`/exam/results/${user.userid}`);
          if (response.data.success && Array.isArray(response.data.data)) {
            const progressMap = {};
            response.data.data.forEach((course) => {
              progressMap[course.courseId] = course.completionPercentage || 0;
            });
            setUserProgress(progressMap);
          }
        } catch (error) {
          console.error("Error loading user progress:", error);
        }
      }
    };

    loadUserProgress();

    const handleProgressUpdate = (event) => {
      setUserProgress((prev) => ({
        ...prev,
        [event.detail.courseId]: event.detail.completionPercentage,
      }));
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);

    const handleExamSubmission = () => {
      loadUserProgress();
    };

    window.addEventListener("examSubmitted", handleExamSubmission);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
      window.removeEventListener("examSubmitted", handleExamSubmission);
    };
  }, [navigate]);

  const filteredCourses = subjectsData.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      CSE: "bg-blue-50 text-blue-700 border-blue-200",
      ECE: "bg-green-50 text-green-700 border-green-200",
      Mechanical: "bg-orange-50 text-orange-700 border-orange-200",
      Civil: "bg-cyan-50 text-cyan-700 border-cyan-200",
      EEE: "bg-pink-50 text-pink-700 border-pink-200",
      Diploma: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <>
      <Helmet>
        <title>Courses - SkillTrack LMS</title>
        <meta
          name="Courses page"
          content="Explore all courses in SkillTrack Learning Management System"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Learning <span className="text-blue-600">Dashboard</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access comprehensive courses and track your learning progress
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  className="block w-full pl-3 pr-10 py-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const progress = userProgress[course.id] || 0;
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Course Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                            course.category
                          )}`}
                        >
                          {course.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiUsers className="h-4 w-4 mr-1" />
                          <span>Beginner</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {course.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      {progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                progress
                              )} transition-all duration-300`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Course Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="h-4 w-4 mr-1" />
                          <span>Self-paced</span>
                        </div>
                        <Link
                          to={`/courses/${encodeURIComponent(course.category)}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Continue Learning
                          <FiChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiBook className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any courses matching your search criteria. Try
                adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Viewcourses;
