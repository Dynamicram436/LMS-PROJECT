import React, { useState, useEffect, useMemo } from "react";
import { useParams, Routes, Route, useNavigate } from "react-router-dom";
import Exam from "./Exam";
import { syllabusData } from "./courseCatalog";
import ProgressService from "../utils/ProgressService";
import {
  FiArrowLeft,
  FiBookOpen,
  FiPlayCircle,
  FiEdit3,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiAward,
} from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const Highlighter = ({ children, color = "bg-slate-200/60" }) => (
  <span className="relative inline-block px-1">
    <span className="relative z-10">{children}</span>
    <span
      className={`absolute left-0 bottom-1 w-full h-3 ${color} -rotate-1 rounded-sm z-0`}
    />
  </span>
);

const ProgressBar = ({ percentage, color = "bg-slate-800" }) => (
  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
    <div
      className={`h-full ${color} transition-all duration-1000 ease-out`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

const Courses = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const navigate = useNavigate();

  const branchSyllabus = useMemo(
    () => syllabusData.find((s) => s.category === subject) || { units: [] },
    [subject],
  );

  const [activeTopic, setActiveTopic] = useState(null);
  const [openUnits, setOpenUnits] = useState({});
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.userid) {
        try {
          const results = await ProgressService.getUserProgress(user.userid);
          if (results.success && results.data) {
            const courseResult = results.data.find(
              (r) => r.courseId === subject,
            );
            if (courseResult) {
              setCompletedVideos(
                courseResult.videos
                  ?.filter((v) => v.isCompleted)
                  .map((v) => v.videoId) || [],
              );
              setOverallProgress(courseResult.completionPercentage || 0);
            }
          }
        } catch (err) {
          console.error("Failed to fetch progress:", err);
        }
      }
      setLoading(false);
    };

    fetchProgress();

    // Auto-select first incomplete topic or first topic
    const selectInitialTopic = () => {
      if (branchSyllabus.units.length > 0) {
        // Flatten all topics to find the first incomplete one
        const allTopics = branchSyllabus.units.flatMap((u) => u.topics);
        const firstIncomplete =
          allTopics.find((t) => !completedVideos.includes(t.id)) ||
          allTopics[0];

        if (firstIncomplete) {
          setActiveTopic(firstIncomplete);

          // Find which unit contains this topic and expand it
          const parentUnit = branchSyllabus.units.find((u) =>
            u.topics.some((t) => t.id === firstIncomplete.id),
          );
          if (parentUnit) {
            setOpenUnits({ [parentUnit.id]: true });
          }
        }
      }
    };

    if (!activeTopic && branchSyllabus.units.length > 0) {
      selectInitialTopic();
    }
  }, [subject, branchSyllabus, completedVideos.length]);

  const toggleUnit = (unitId) => {
    setOpenUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleTopicSelect = (topic) => {
    setActiveTopic(topic);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkAsCompleted = async () => {
    if (!user?.userid || !activeTopic) return;

    try {
      const result = await ProgressService.updateVideoProgress(
        user.userid,
        subject,
        activeTopic.id,
        true,
      );

      if (result.success) {
        toast.success("Progress saved!");
        setCompletedVideos((prev) => [...new Set([...prev, activeTopic.id])]);
        setOverallProgress(result.data.completionPercentage);
      }
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };

  const isCompleted = (topicId) => completedVideos.includes(topicId);

  return (
    <>
      <Helmet>
        <title>{subject} - Learning Modules</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => navigate("/viewcourses")}
              className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors font-semibold"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Subjects</span>
            </button>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Your Progress
                </span>
                <div className="flex items-center gap-3 w-32">
                  <ProgressBar percentage={overallProgress} />
                  <span className="text-xs font-bold text-slate-700">
                    {overallProgress}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <FiBookOpen className="w-4 h-4" />
                <span>Learning Dashboard</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 pt-24">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                {subject}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 flex items-center gap-1">
                <FiAward className="w-3 h-3" />
                {overallProgress}% Complete
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Master the{" "}
              <Highlighter color="bg-slate-200/50">Curriculum</Highlighter>
            </h1>
          </header>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Main Content Area */}
            <div className="flex-1 w-full order-1">
              {activeTopic ? (
                <div className="relative group">
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl shadow-slate-100 border-8 border-white">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeTopic.videoId}?rel=0&modestbranding=1`}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeTopic.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="mt-8 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-2 w-2 rounded-full bg-slate-500 animate-pulse"></span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                            Active Topic
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                          {activeTopic.name}
                          {isCompleted(activeTopic.id) && (
                            <FiCheckCircle className="text-green-500 w-6 h-6" />
                          )}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                            {activeTopic.duration}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              activeTopic.difficulty === "Beginner"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : activeTopic.difficulty === "Intermediate"
                                  ? "bg-orange-50 text-orange-600 border-orange-100"
                                  : "bg-purple-50 text-purple-600 border-purple-100"
                            }`}
                          >
                            {activeTopic.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-4 font-medium leading-relaxed">
                          {activeTopic.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleMarkAsCompleted}
                          disabled={isCompleted(activeTopic.id)}
                          className={`inline-flex cursor-pointer items-center justify-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 text-sm ${
                            isCompleted(activeTopic.id)
                              ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                              : "bg-white text-slate-800 border-2 border-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <FiCheckCircle className="w-5 h-5" />
                          {isCompleted(activeTopic.id)
                            ? "Completed"
                            : "Mark as Done"}
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/courses/${encodeURIComponent(subject)}/exam?chapterId=${activeTopic.id}`,
                            )
                          }
                          className="inline-flex cursor-pointer items-center justify-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.05] active:scale-95 text-sm"
                        >
                          <FiEdit3 className="w-5 h-5" />
                          Take Quiz
                        </button>
                        {(() => {
                          const flattenedTopics = branchSyllabus.units.flatMap(
                            (u) => u.topics,
                          );
                          const currentIndex = flattenedTopics.findIndex(
                            (t) => t.id === activeTopic.id,
                          );
                          const nextTopic = flattenedTopics[currentIndex + 1];
                          if (nextTopic) {
                            return (
                              <button
                                onClick={() => handleTopicSelect(nextTopic)}
                                className="inline-flex cursor-pointer items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.05] active:scale-95 text-sm"
                              >
                                <span>Next Lesson</span>
                                <FiArrowLeft className="rotate-180" />
                              </button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                  <FiPlayCircle className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Select a topic to start learning
                  </h3>
                </div>
              )}
            </div>

            {/* Syllabus Sidebar */}
            <div className="w-full lg:w-[400px] order-2 sticky top-24">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Course Syllabus
                  </h3>
                  <span className="text-[10px] font-black text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    {branchSyllabus.units.reduce(
                      (acc, unit) => acc + unit.topics.length,
                      0,
                    )}{" "}
                    LESSONS
                  </span>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {branchSyllabus.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="border-b border-slate-50 last:border-0 pb-2"
                    >
                      <button
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors group"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-500" />
                            {unit.name}
                          </span>
                          <div className="ml-4 w-24">
                            <ProgressBar
                              percentage={Math.round(
                                (unit.topics.filter((t) => isCompleted(t.id))
                                  .length /
                                  unit.topics.length) *
                                  100,
                              )}
                              color="bg-green-500"
                            />
                          </div>
                        </div>
                        {openUnits[unit.id] ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </button>

                      {openUnits[unit.id] && (
                        <div className="mt-2 ml-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          {unit.topics.map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => handleTopicSelect(topic)}
                              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                                activeTopic?.id === topic.id
                                  ? "bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-200"
                                  : "bg-transparent border-transparent hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                  {isCompleted(topic.id) ? (
                                    <FiCheckCircle className="text-green-500 w-3 h-3" />
                                  ) : (
                                    <span
                                      className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                        activeTopic?.id === topic.id
                                          ? "bg-white/10 border-white/20"
                                          : "bg-slate-100 border-slate-200"
                                      }`}
                                    >
                                      QUIZ
                                    </span>
                                  )}
                                  <span className="font-bold text-xs truncate">
                                    {topic.name}
                                  </span>
                                </div>
                                <div className="flex gap-2 ml-5">
                                  <span
                                    className={`text-[8px] font-medium opacity-60`}
                                  >
                                    {topic.duration}
                                  </span>
                                  <span
                                    className={`text-[8px] font-medium opacity-60`}
                                  >
                                    •
                                  </span>
                                  <span
                                    className={`text-[8px] font-medium opacity-60`}
                                  >
                                    {topic.difficulty}
                                  </span>
                                </div>
                              </div>
                              <FiPlayCircle
                                className={`w-4 h-4 shrink-0 ${activeTopic?.id === topic.id ? "text-white" : "text-slate-300"}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

const CoursesWithExam = () => (
  <Routes>
    <Route index element={<Courses />} />
    <Route path="exam" element={<Exam />} />
  </Routes>
);

export { CoursesWithExam };
export default Courses;
