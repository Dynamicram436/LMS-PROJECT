import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { FaGraduationCap, FaCalendarAlt, FaBook, FaArrowRight, FaUniversity } from "react-icons/fa";

const ExamSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [structure, setStructure] = useState([]);

    // Selection states
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    // Options derived from selection
    const [availableYears, setAvailableYears] = useState([]);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    useEffect(() => {
        fetchCourseStructure();
    }, []);

    const fetchCourseStructure = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/exam/structure");
            if (response.data.success) {
                setStructure(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching course structure:", error);
            toast.error("Failed to load course options");
        } finally {
            setLoading(false);
        }
    };

    // Handle Branch Change
    const handleBranchChange = (e) => {
        const branchName = e.target.value;
        setSelectedBranch(branchName);
        setSelectedYear("");
        setSelectedSemester("");
        setSelectedSubject("");

        if (branchName) {
            const branchData = structure.find(b => b.branch === branchName);
            setAvailableYears(branchData ? branchData.years : []);
        } else {
            setAvailableYears([]);
        }
        setAvailableSemesters([]);
        setAvailableSubjects([]);
    };

    // Handle Year Change
    const handleYearChange = (e) => {
        const year = parseInt(e.target.value);
        setSelectedYear(year);
        setSelectedSemester("");
        setSelectedSubject("");

        if (year) {
            const branchData = structure.find(b => b.branch === selectedBranch);
            const yearData = branchData.years.find(y => y.year === year);
            setAvailableSemesters(yearData ? yearData.semesters : []);
        } else {
            setAvailableSemesters([]);
        }
        setAvailableSubjects([]);
    };

    // Handle Semester Change
    const handleSemesterChange = (e) => {
        const semester = parseInt(e.target.value);
        setSelectedSemester(semester);
        setSelectedSubject("");

        if (semester) {
            const branchData = structure.find(b => b.branch === selectedBranch);
            const yearData = branchData.years.find(y => y.year === selectedYear);
            const semesterData = yearData.semesters.find(s => s.semester === semester);
            setAvailableSubjects(semesterData ? semesterData.subjects : []);
        } else {
            setAvailableSubjects([]);
        }
    };

    const handleStartExam = () => {
        if (selectedBranch && selectedYear && selectedSemester && selectedSubject) {
            // Navigate to Exam page with query parameters
            navigate(`/courses/${selectedBranch}/exam?subject=${encodeURIComponent(selectedSubject)}&year=${selectedYear}&semester=${selectedSemester}&category=${selectedBranch}`);
        } else {
            toast.warning("Please select all fields to start the exam");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Exam Selection</h1>
                        <p className="text-blue-100">Select your course details to begin the assessment</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Branch Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaUniversity className="text-blue-500" />
                                    Branch
                                </label>
                                <select
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="">Select Branch</option>
                                    {structure.map((item) => (
                                        <option key={item._id} value={item.branch}>
                                            {item.branch}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaGraduationCap className="text-blue-500" />
                                    Year
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    disabled={!selectedBranch}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors bg-white ${!selectedBranch ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                >
                                    <option value="">Select Year</option>
                                    {availableYears.map((y) => (
                                        <option key={y._id} value={y.year}>
                                            {y.year === 1 ? "1st Year" :
                                                y.year === 2 ? "2nd Year" :
                                                    y.year === 3 ? "3rd Year" :
                                                        y.year === 4 ? "4th Year" : `${y.year} Year`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaCalendarAlt className="text-blue-500" />
                                    Semester
                                </label>
                                <select
                                    value={selectedSemester}
                                    onChange={handleSemesterChange}
                                    disabled={!selectedYear}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors bg-white ${!selectedYear ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                >
                                    <option value="">Select Semester</option>
                                    {availableSemesters.map((s) => (
                                        <option key={s._id} value={s.semester}>
                                            Semester {s.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaBook className="text-blue-500" />
                                    Subject
                                </label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    disabled={!selectedSemester}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors bg-white ${!selectedSemester ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                >
                                    <option value="">Select Subject</option>
                                    {availableSubjects.map((sub, idx) => (
                                        <option key={idx} value={sub}>
                                            {sub}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleStartExam}
                                disabled={!selectedSubject}
                                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${selectedSubject
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:-translate-y-1"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <span>Start Assessment</span>
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamSelection;
