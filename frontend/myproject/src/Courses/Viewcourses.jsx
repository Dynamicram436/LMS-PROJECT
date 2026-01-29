import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBook, FiFilter, FiArrowRight } from "react-icons/fi";
import { subjectsData, categories } from "./courseCatalog";
import { Helmet } from "react-helmet-async";

const Viewcourses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
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
      CSE: "bg-indigo-100 text-indigo-800",
      ECE: "bg-emerald-100 text-emerald-800",
      Mechanical: "bg-orange-100 text-orange-800",
      Civil: "bg-blue-100 text-blue-800",
      EEE: "bg-pink-100 text-pink-800",
      Diploma: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Helmet>
        <title>Courses - SkillTrack</title>
        <meta
          name="Courses page"
          content="View all available courses on SkillTrack"
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            B.Tech & <span className="text-indigo-600">Diploma</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-gray-600 mx-auto">
            Explore your technical branch and start learning with our comprehensive
            study guides
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <FiFilter className="h-5 w-5 text-gray-400 shrink-0" />
              <select
                className="block w-full lg:w-64 cursor-pointer pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Branches" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col min-h-[320px]"
              >
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getCategoryColor(
                        course.category
                      )}`}
                    >
                      {course.category}
                    </span>
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <FiBook className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-8 line-clamp-3 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-end">
                    <Link
                      to={`/courses/${encodeURIComponent(course.category)}`}
                      className="inline-flex items-center cursor-pointer px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
                    >
                      View course
                      <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No branches found
            </h3>
            <p className="mt-2 text-gray-500 max-w-xs mx-auto">
              We couldn't find any branches matching your current search or filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Viewcourses;
