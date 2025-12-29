import React from "react";
import { useParams, Routes, Route, useNavigate } from "react-router-dom";
import Exam from "./Exam";
import { chaptersData } from "./courseCatalog";
import { FiArrowLeft, FiBookOpen, FiPlayCircle, FiEdit3 } from "react-icons/fi";

const Highlighter = ({ children, color = "bg-yellow-200/60" }) => (
  <span className="relative inline-block px-1">
    <span className="relative z-10">{children}</span>
    <span
      className={`absolute left-0 bottom-1 w-full h-3 ${color} -rotate-1 rounded-sm z-0`}
    />
  </span>
);

const Courses = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const chapters = chaptersData.filter((c) => c.category === subject);
  const navigate = useNavigate();

  const [activeVideo, setActiveVideo] = React.useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const activeIndex = chapters.findIndex(
    (c) => c.id === activeVideo?.chapter?.id
  );
  const displayIndex = activeIndex !== -1 ? activeIndex + 1 : 1;

  React.useEffect(() => {
    if (chapters.length > 0 && !activeVideo) {
      setActiveVideo({
        chapter: chapters[0],
        videoId: chapters[0].youtubeIds?.[0] || null,
      });
    }
  }, [chapters, activeVideo]);

  const handleVideoSelect = (chapter) => {
    setActiveVideo({
      chapter: chapter,
      videoId: chapter.youtubeIds?.[0] || null,
    });
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors font-semibold"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Subjects</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <FiBookOpen className="w-4 h-4" />
            <span>Learning Dashboard</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-24">
        {/* Page Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
              {subject || "Unknown Subject"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Level Up Your{" "}
            <Highlighter color="bg-indigo-200/50">Knowledge</Highlighter>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Side: Video Player (Main content) */}
          <div className="flex-1 w-full order-1">
            <section className="">
              {activeVideo?.videoId ? (
                <div className="relative group">
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl shadow-indigo-100 border-8 border-white">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeVideo.chapter.name}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Now Playing Info */}
                  <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">
                          Currently Learning
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {activeVideo.chapter.name}
                      </h2>
                      <p className="text-slate-500 mt-2 font-medium italic leading-relaxed">
                        {activeVideo.chapter.description ||
                          "In this module, we'll dive deep into core concepts and practical applications."}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/courses/${encodeURIComponent(
                            subject
                          )}/exam?chapterId=${activeVideo.chapter.id}`
                        )
                      }
                      className="inline-flex cursor-pointer shrink-0 items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.05] active:scale-95 text-sm"
                    >
                      <FiEdit3 className="w-5 h-5" />
                      Take Assessment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <FiPlayCircle className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Select a Lesson
                  </h3>
                  <p className="text-slate-500 max-w-xs">
                    Pick a chapter from the modules list to begin your study
                    session.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Side: Chapter Selection (On Desktop) or Bottom (On Mobile) */}
          <div className="w-full lg:w-[380px] order-2 sticky top-24">
            <section className="relative z-40">
              <div className="mb-5 flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Course Syllabus
                </h3>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  {chapters.length} LESSONS
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] p-5 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {displayIndex.toString().padStart(2, "0")}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">
                        Active Module
                      </p>
                      <p className="font-bold text-slate-900 truncate max-w-[150px] md:max-w-none">
                        {activeVideo?.chapter?.name || "Choose a chapter"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`transition-transform duration-500 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.15)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-3">
                      {chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer mb-2 ${
                            activeVideo?.chapter?.id === chapter.id
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "hover:bg-indigo-50 border border-transparent"
                          }`}
                          onClick={() => handleVideoSelect(chapter)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <span
                              className={`text-xs font-black ${
                                activeVideo?.chapter?.id === chapter.id
                                  ? "text-indigo-200"
                                  : "text-slate-300 group-hover:text-indigo-400"
                              }`}
                            >
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <p
                                className={`font-bold transition-colors truncate ${
                                  activeVideo?.chapter?.id === chapter.id
                                    ? "text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                {chapter.name}
                              </p>
                              <p
                                className={`text-[10px] truncate ${
                                  activeVideo?.chapter?.id === chapter.id
                                    ? "text-indigo-100"
                                    : "text-slate-400"
                                }`}
                              >
                                {chapter.description || "Video Lecture"}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ml-4 ${
                              activeVideo?.chapter?.id === chapter.id
                                ? "bg-white text-indigo-600 scale-110 shadow-md"
                                : "bg-slate-100 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white"
                            }`}
                          >
                            <FiPlayCircle className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Empty State */}
        {chapters.length === 0 && (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center mt-10">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
              �
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No Course Material Found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed font-medium">
              We're currently preparing the content for this subject. Please
              check back later!
            </p>
          </div>
        )}
      </main>

      {/* Decorative elements */}
      <div className="fixed bottom-0 right-10 p-8 pointer-events-none opacity-[0.03] hidden xl:block">
        <div className="text-[15rem] font-black select-none tracking-tighter">
          STUDY
        </div>
      </div>
    </div>
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
