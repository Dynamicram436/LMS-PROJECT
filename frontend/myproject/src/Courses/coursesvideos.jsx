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
  FiClock,
  FiBarChart2,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const Highlighter = ({ children, color = "bg-blue-100" }) => (
  <span className="relative inline-block px-1">
    <span className="relative z-10">{children}</span>
    <span
      className={`absolute left-0 bottom-1 w-full h-3 ${color} rounded-sm z-0`}
    />
  </span>
);

const ProgressBar = ({ percentage, color = "bg-blue-600", height = "h-2" }) => (
  <div className={`w-full bg-gray-200 ${height} rounded-full overflow-hidden`}>
    <div
      className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

const Courses = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const branchSyllabus = useMemo(
    () => syllabusData.find((s) => s.category === subject) || { units: [] },
    [subject]
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
              (r) => String(r.courseId) === String(subject)
            );
            if (courseResult) {
              setCompletedVideos(
                courseResult.videos
                  ?.filter((v) => v.isCompleted)
                  .map((v) => String(v.videoId)) || []
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

    const selectInitialTopic = () => {
      if (branchSyllabus.units.length > 0) {
        const allTopics = branchSyllabus.units.flatMap((u) => u.topics);
        const firstIncomplete =
          allTopics.find((t) => !completedVideos.includes(String(t.id))) ||
          allTopics[0];

        if (firstIncomplete) {
          setActiveTopic(firstIncomplete);
          const parentUnit = branchSyllabus.units.find((u) =>
            u.topics.some((t) => String(t.id) === String(firstIncomplete.id))
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

    const handleProgressUpdate = (event) => {
      if (event.detail.courseId === subject) {
        setOverallProgress(event.detail.completionPercentage || 0);
        if (user?.userid) {
          ProgressService.getUserProgress(user.userid)
            .then((results) => {
              if (results.success && results.data) {
                const courseResult = results.data.find(
                  (r) => String(r.courseId) === String(subject)
                );
                if (courseResult) {
                  setCompletedVideos(
                    courseResult.videos
                      ?.filter((v) => v.isCompleted)
                      .map((v) => String(v.videoId)) || []
                  );
                }
              }
            })
            .catch((err) => {
              console.error("Failed to refresh progress after update:", err);
            });
        }
      }
    };

    const handleExamSubmission = (event) => {
      if (event.detail.userId === user?.userid) {
        if (user?.userid) {
          ProgressService.getUserProgress(user.userid)
            .then((results) => {
              if (results.success && results.data) {
                const courseResult = results.data.find(
                  (r) => String(r.courseId) === String(subject)
                );
                if (courseResult) {
                  setOverallProgress(courseResult.completionPercentage || 0);
                  setCompletedVideos(
                    courseResult.videos
                      ?.filter((v) => v.isCompleted)
                      .map((v) => String(v.videoId)) || []
                  );
                }
              }
            })
            .catch((err) => {
              console.error(
                "Failed to refresh progress after exam submission:",
                err
              );
            });
        }
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    window.addEventListener("examSubmitted", handleExamSubmission);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
      window.removeEventListener("examSubmitted", handleExamSubmission);
    };
  }, [
    subject,
    branchSyllabus,
    completedVideos.length,
    user?.userid,
    activeTopic,
  ]);

  const toggleUnit = (unitId) => {
    setOpenUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleTopicSelect = (topic) => {
    setActiveTopic(topic);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkAsCompleted = async () => {
    if (!user?.userid || !activeTopic) {
      toast.error("User or topic information is missing");
      return;
    }

    // Calculate total videos
    const allTopics = branchSyllabus.units.flatMap((u) => u.topics);
    const totalVideos = allTopics.length;

    try {
      const result = await ProgressService.updateVideoProgress(
        user.userid,
        String(subject),
        String(activeTopic.id),
        true,
        100, // Explicitly set to 100% completion
        totalVideos
      );

      if (result.success) {
        toast.success("Progress saved!");
        setCompletedVideos((prev) => [...new Set([...prev, String(activeTopic.id)])]);
        
        // Calculate new overall progress
        const allTopics = branchSyllabus.units.flatMap((u) => u.topics);
        const newCompletedCount = completedVideos.includes(String(activeTopic.id)) 
          ? completedVideos.length 
          : completedVideos.length + 1;
        const newOverallProgress = Math.round((newCompletedCount / allTopics.length) * 100);
        
        setOverallProgress(newOverallProgress);

        try {
          const updatedUser = JSON.parse(localStorage.getItem("user"));
          if (updatedUser) {
            if (!updatedUser.examResults) {
              updatedUser.examResults = [];
            }

            const courseIndex = updatedUser.examResults.findIndex(
              (course) => String(course.courseId) === String(subject)
            );
            if (courseIndex !== -1) {
              updatedUser.examResults[courseIndex].completionPercentage = newOverallProgress;
            } else {
              updatedUser.examResults.push({
                courseId: subject,
                completionPercentage: newOverallProgress,
              });
            }

            if (!updatedUser.courseProgress) {
              updatedUser.courseProgress = [];
            }

            const courseProgressIndex = updatedUser.courseProgress.findIndex(
              (cp) => String(cp.courseId) === String(subject)
            );
            if (courseProgressIndex !== -1) {
              updatedUser.courseProgress[courseProgressIndex].completionPercentage = newOverallProgress;
            } else {
              updatedUser.courseProgress.push({
                courseId: subject,
                completionPercentage: newOverallProgress,
                videos: [],
                exam: { attempts: 0, passed: false, score: 0 },
              });
            }

            localStorage.setItem("user", JSON.stringify(updatedUser));

            window.dispatchEvent(
              new CustomEvent("progressUpdated", {
                detail: {
                  userId: updatedUser.userid,
                  courseId: subject,
                  completionPercentage: newOverallProgress,
                },
              })
            );
          }
        } catch (storageErr) {
          console.error(
            "Error updating user data in localStorage:",
            storageErr
          );
        }
      } else {
        toast.error(result.message || "Failed to save progress");
      }
    } catch (error) {
      console.error("Error marking topic as completed:", error);
      if (error.response) {
        toast.error(
          `Server error: ${error.response.data.message || "Failed to save progress"
          }`
        );
      } else if (error.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error(`Error: ${error.message || "Failed to save progress"}`);
      }
    }
  };

  const isCompleted = (topicId) => completedVideos.includes(String(topicId));

  const isValidYouTubeId = (id) => {
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{subject} - Learning Modules</title>
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/viewcourses")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mr-6"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Courses</span>
              </button>

              <div className="hidden md:flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {subject}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FiBarChart2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                </div>
                <div className="w-32">
                  <ProgressBar
                    percentage={overallProgress}
                    color="bg-blue-600"
                    height="h-2"
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {overallProgress}%
                </span>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {activeTopic ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Video Player */}
                <div className="aspect-video bg-gray-900">
                  {isValidYouTubeId(activeTopic.videoId) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeTopic.videoId}?rel=0&modestbranding=1&showinfo=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeTopic.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p className="text-lg">Invalid video ID</p>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Current Lesson
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {activeTopic.name}
                        {isCompleted(activeTopic.id) && (
                          <FiCheckCircle className="text-green-500 w-6 h-6" />
                        )}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          <FiClock className="w-4 h-4" />
                          {activeTopic.duration}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                            activeTopic.difficulty
                          )}`}
                        >
                          {activeTopic.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleMarkAsCompleted}
                        disabled={isCompleted(activeTopic.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isCompleted(activeTopic.id)
                            ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                          }`}
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        {isCompleted(activeTopic.id)
                          ? "Completed"
                          : "Mark Complete"}
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/courses/${encodeURIComponent(
                              subject
                            )}/exam?chapterId=${activeTopic.id}`
                          )
                        }
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow"
                      >
                        <FiEdit3 className="w-4 h-4" />
                        Take Quiz
                      </button>
                      {(() => {
                        const flattenedTopics = branchSyllabus.units.flatMap(
                          (u) => u.topics
                        );
                        const currentIndex = flattenedTopics.findIndex(
                          (t) => String(t.id) === String(activeTopic.id)
                        );
                        const nextTopic = flattenedTopics[currentIndex + 1];
                        if (nextTopic) {
                          return (
                            <button
                              onClick={() => handleTopicSelect(nextTopic)}
                              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow"
                            >
                              <span>Next Lesson</span>
                              <FiArrowLeft className="rotate-180 w-4 h-4" />
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {activeTopic.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-12">
                <FiPlayCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a lesson to begin learning
                </h3>
                <p className="text-gray-500">
                  Choose a topic from the course syllabus to start your learning
                  journey
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside
            className={`w-full lg:w-80 ${sidebarOpen ? "block" : "hidden"
              } lg:block`}
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Content
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {branchSyllabus.units.reduce(
                      (acc, unit) => acc + unit.topics.length,
                      0
                    )}{" "}
                    lessons
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Your progress: {overallProgress}%
                  </span>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    percentage={overallProgress}
                    color="bg-blue-600"
                    height="h-2"
                  />
                </div>
              </div>

              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                {branchSyllabus.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {unit.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {
                              unit.topics.filter((t) => isCompleted(t.id))
                                .length
                            }
                            /{unit.topics.length} completed
                          </span>
                          <div className="flex-1 max-w-20">
                            <ProgressBar
                              percentage={Math.round(
                                (unit.topics.filter((t) => isCompleted(t.id))
                                  .length /
                                  unit.topics.length) *
                                100
                              )}
                              color="bg-green-500"
                              height="h-1"
                            />
                          </div>
                        </div>
                      </div>
                      {openUnits[unit.id] ? (
                        <FiChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {openUnits[unit.id] && (
                      <div className="border-t border-gray-100">
                        {unit.topics.map((topic) => (
                          <div
                            key={topic.id}
                            onClick={() => handleTopicSelect(topic)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-l-4 ${activeTopic?.id === topic.id
                                ? "bg-blue-50 border-blue-500"
                                : "hover:bg-gray-50 border-transparent"
                              }`}
                          >
                            <div className="flex-shrink-0">
                              {isCompleted(topic.id) ? (
                                <FiCheckCircle className="text-green-500 w-5 h-5" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                  <FiPlayCircle className="w-3 h-3 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${activeTopic?.id === topic.id
                                    ? "text-blue-700"
                                    : "text-gray-900"
                                  }`}
                              >
                                {topic.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {topic.duration}
                                </span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-500">
                                  {topic.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
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
