import apiClient from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { BarChart } from "@mui/x-charts/BarChart";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        if (!userData?.userid) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch user info
        try {
          const userResponse = await apiClient.get(
            `/auth/user/${userData.userid}`,
            { signal }
          );

          if (userResponse?.data?.data) {
            setUser(userResponse.data.data);
            userData.courseProgress = userResponse.data.data.courseProgress || [];
            localStorage.setItem("user", JSON.stringify(userData));
          } else if (userResponse?.data?.message === "User not found") {
            setUser(userData);
          }
        } catch (userErr) {
          console.error("Error fetching user:", userErr);
          setUser(userData);
        }

        // Fetch exam results
        try {
          const resultsResponse = await apiClient.get(
            `/exam/results/${userData.userid}`,
            {
              signal,
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            }
          );

          if (resultsResponse?.data?.success) {
            const results = Array.isArray(resultsResponse.data.data)
              ? resultsResponse.data.data
              : [];
            setExamResults(results);
            const updatedUser = { ...userData, examResults: results };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            setExamResults(userData.examResults || []);
          }
        } catch (error) {
          console.error('Error fetching exam results:', error);
          setExamResults(userData.examResults || []);
          if (error.response?.status === 401) {
            localStorage.removeItem("user");
            navigate("/login");
            toast.error("Session expired. Please log in again.");
          }
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const handleExamSubmission = (event) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.userid === event.detail.userId) {
        fetchUserData();
      }
    };

    window.addEventListener('examSubmitted', handleExamSubmission);

    return () => {
      controller.abort();
      window.removeEventListener('examSubmitted', handleExamSubmission);
    };
  }, []);

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 70) return "💪";
    if (percentage >= 50) return "📚";
    return "✍️";
  };

  const refreshExamResults = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const userData = JSON.parse(storedUser);
      const resultsResponse = await apiClient.get(
        `/exam/results/${userData.userid}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      if (resultsResponse?.data?.success) {
        const results = Array.isArray(resultsResponse.data.data) ? resultsResponse.data.data : [];
        setExamResults(results);
        const updatedUser = { ...userData, examResults: results };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Exam data refreshed!");
      }
    } catch (error) {
      toast.error("Failed to refresh exam data");
    }
  };

  // Prepare chart data
  const chartData = examResults.map(course => {
    const latestAttempt = course.examAttempts && course.examAttempts.length > 0
      ? course.examAttempts[course.examAttempts.length - 1]
      : { score: 0 };
    return {
      course: course.courseName || course.courseId,
      score: latestAttempt.score || 0
    };
  }).slice(0, 5); // Show only top 5 for better visualization

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SkillTrack</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 mb-6">
            Welcome back, {user?.name || "Student"} 👋
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Elevate your potential.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Your personalized learning dashboard. Monitor your progress,
            achieve your milestones, and master new skills.
          </p>
        </div>

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Statistics</h3>
                  <button
                    onClick={refreshExamResults}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 font-medium">Exams Attempted</span>
                    <span className="text-4xl font-black text-slate-900 leading-none">
                      {examResults.reduce((sum, course) => sum + (course.examAttempts?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 font-medium">Courses Started</span>
                    <span className="text-4xl font-black text-slate-900 leading-none">
                      {examResults.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Card */}
              {chartData.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Comparison</h3>
                  <div className="h-64">
                    <BarChart
                      dataset={chartData}
                      xAxis={[{ scaleType: 'band', dataKey: 'course' }]}
                      series={[{ dataKey: 'score', label: 'Score %', color: '#4f46e5' }]}
                      height={250}
                      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-2 text-white">Continue Learning</h4>
                  <p className="text-slate-400 text-sm mb-6">
                    Consistency is key to mastery. Pick up where you left off.
                  </p>
                  <button
                    onClick={() => navigate("/viewcourses")}
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10"
                  >
                    Explore Courses
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Recent Performance</h3>
                  {examResults.length > 0 && (
                    <button
                      onClick={() => navigate("/performance/all")}
                      className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors flex items-center gap-2 group"
                    >
                      View All
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {examResults.length > 0 ? (
                  <div className="space-y-4">
                    {examResults.slice(0, 4).map((course, idx) => {
                      const latestAttempt = course.examAttempts?.length > 0
                        ? course.examAttempts[course.examAttempts.length - 1]
                        : null;
                      return (
                        <div
                          key={idx}
                          onClick={() => navigate(`/performance/${encodeURIComponent(course.courseId)}`)}
                          className="p-4 border border-slate-50 rounded-2xl bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform shadow-sm">
                              {latestAttempt ? getScoreEmoji(latestAttempt.score || 0) : "📖"}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">
                                {course.courseName || course.courseId}
                              </h4>
                              {latestAttempt ? (
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                    {latestAttempt.score}%
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {course.examAttempts?.length} attempt(s)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 mt-1 italic">Not started yet</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {latestAttempt?.passed ? (
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                                Passed
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                                Pending
                              </span>
                            )}
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all border border-transparent group-hover:border-indigo-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">📚</div>
                    <h4 className="font-bold text-slate-900 mb-1">Begin your journey</h4>
                    <p className="text-slate-500 text-sm max-w-[200px]">Start your first course to see your progress here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
