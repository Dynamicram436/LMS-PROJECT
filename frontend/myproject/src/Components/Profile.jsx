import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaGraduationCap, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            toast.error("User data not found. Please log in.");
        }
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-slate-900"></div>
            </div>
        );
    }

    const examResults = user.examResults || [];
    const totalAttempts = examResults.reduce((sum, course) => sum + (course.examAttempts?.length || 0), 0);
    const coursesStarted = examResults.length;
    const passedCourses = examResults.filter(course =>
        course.examAttempts?.some(attempt => attempt.passed)
    ).length;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Header Section */}
                <div className="h-32 bg-slate-50 border-b border-slate-100"></div>

                <div className="relative px-8 pb-8">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-8">
                        <div className="p-1 bg-white rounded-2xl border border-slate-200">
                            <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center">
                                <FaUserCircle className="text-6xl text-slate-300" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900">{user.name}</h1>
                                <div className="flex items-center gap-2 mt-1 text-slate-500">
                                    <FaEnvelope className="text-sm" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                            </div>
                            <button className="px-5 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                            <div className="p-5 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3 text-slate-400">
                                    <FaGraduationCap />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Courses</span>
                                </div>
                                <div className="text-xl font-semibold text-slate-900">{coursesStarted} Started</div>
                            </div>

                            <div className="p-5 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3 text-slate-400">
                                    <FaTrophy />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Exams</span>
                                </div>
                                <div className="text-xl font-semibold text-slate-900">{totalAttempts} Attempts</div>
                            </div>

                            <div className="p-5 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3 text-slate-400">
                                    <FaCalendarAlt />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Progress</span>
                                </div>
                                <div className="text-xl font-semibold text-slate-900">{passedCourses} Completed</div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="mt-10 pt-10 border-t border-slate-100">
                            <h2 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Account Details</h2>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                    <span className="text-sm text-slate-500">User Identifier</span>
                                    <span className="text-sm font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{user.userid}</span>
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
