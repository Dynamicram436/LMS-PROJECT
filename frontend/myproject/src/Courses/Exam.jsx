import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { chaptersData } from "./courseCatalog";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaRedo,
  FaHome,
  FaTrophy,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";

const makeDefaultChapterQuestions = (chapterTitle) => [
  {
    question: `${chapterTitle}: Which statement is true?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  },
  {
    question: `${chapterTitle}: Pick the correct answer.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 1,
  },
  {
    question: `${chapterTitle}: Choose the best option.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2,
  },
  {
    question: `${chapterTitle}: Select the correct one.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 3,
  },
  {
    question: `${chapterTitle}: Final question.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  },
];

const DEFAULT_QUESTIONS = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correctAnswer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    question: "Which is not a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correctAnswer: 3,
  },
];

const normalizeQuestions = (rawQuestions = [], fallbackTitle = "Practice") => {
  const cleaned = (Array.isArray(rawQuestions) ? rawQuestions : []).filter(
    (q) => q?.question && Array.isArray(q?.options) && q.options.length > 1
  );

  // Add unique IDs to questions to track them after shuffling
  const questionsWithIds = cleaned.map((q, index) => ({
    ...q,
    originalIndex: index, // Store original index for tracking
    id: `${q.question.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "")}-${index}`, // Create unique ID
  }));

  if (questionsWithIds.length > 0) return questionsWithIds;

  const defaultQuestions = makeDefaultChapterQuestions(fallbackTitle);
  return defaultQuestions.map((q, index) => ({
    ...q,
    originalIndex: index,
    id: `${q.question.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "")}-${index}`,
  }));
};

const Exam = () => {
  const { category } = useParams();
  const subject = decodeURIComponent(category || "");
  const [searchParams] = useSearchParams();
  const chapterIdParam = searchParams.get("chapterId");
  const chapterId = chapterIdParam ? Number(chapterIdParam) : null;
  const chapter =
    typeof chapterId === "number" && Number.isFinite(chapterId)
      ? chaptersData.find((c) => c.id === chapterId && c.category === subject)
      : null;
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examAttempts, setExamAttempts] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const createAttemptDatabase = async () => {
    if (!user?.userid || !chapterId || !subject) return null;
    
    try {
      const courseId = chapter
        ? `${subject}-chapter-${chapter.id}`
        : subject || category;

      const response = await axios.post(
        "http://localhost:8000/api/exam/attempt-database",
        {
          userId: user.userid,
          courseId: courseId,
          chapterId: chapterId,
          category: subject,
          chapterName: chapter?.name || subject || "Exam"
        }
      );

      if (response.data.success) {
        const newAttemptId = response.data.data.attemptId;
        setAttemptId(newAttemptId);
        return newAttemptId;
      }
    } catch (err) {
      console.error("Error creating attempt database:", err);
      // Fall back to using main database if attempt creation fails
      return null;
    }
    return null;
  };

  const fetchExamAttempts = async () => {
    if (user?.userid && chapterId && subject) {
      try {
        const courseId = chapter
          ? `${subject}-chapter-${chapter.id}`
          : subject || category;

        const response = await axios.get(
          `http://localhost:8000/api/exam/results/${user.userid}`
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          const courseResult = response.data.data.find(
            (result) => result.courseId === courseId
          );

          if (courseResult && Array.isArray(courseResult.examAttempts)) {
            setExamAttempts(courseResult.examAttempts);
          }
        }
      } catch (err) {
        console.error("Error fetching exam attempts:", err);
      }
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create a new attempt database for this exam attempt
        const newAttemptId = await createAttemptDatabase();
        
        if (chapterId && subject) {
          const response = await axios.get(
            "http://localhost:8000/api/exam/questions",
            {
              params: {
                chapterId,
                category: subject,
                attemptId: newAttemptId, // Use the new attempt ID
              },
            }
          );
          if (
            response.data.success &&
            response.data.data?.questions?.length > 0
          ) {
            setQuestions(
              normalizeQuestions(
                response.data.data.questions,
                chapter?.name || subject || "Exam"
              )
            );
            setLoading(false);
            return;
          } else if (response.data.data?.questions?.length === 0) {
            // No questions in database, use fallback
            console.warn(
              "No questions found in database for this chapter, using fallback questions"
            );
          }
        }
        if (chapter?.examQuestions?.length > 0) {
          setQuestions(normalizeQuestions(chapter.examQuestions, chapter.name));
        } else if (chapter) {
          setQuestions(
            normalizeQuestions(
              makeDefaultChapterQuestions(chapter.name),
              chapter.name
            )
          );
        } else {
          setQuestions(
            normalizeQuestions(DEFAULT_QUESTIONS, subject || "Exam")
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        if (chapter?.examQuestions?.length > 0) {
          setQuestions(normalizeQuestions(chapter.examQuestions, chapter.name));
        } else if (chapter) {
          setQuestions(
            normalizeQuestions(
              makeDefaultChapterQuestions(chapter.name),
              chapter.name
            )
          );
        } else {
          setQuestions(
            normalizeQuestions(DEFAULT_QUESTIONS, subject || "Exam")
          );
        }
        setLoading(false);
        setError(
          "Note: Using local/default questions as server connection failed."
        );
      }
    };
    fetchQuestions();
  }, [chapterId, subject, chapter]);

  useEffect(() => {
    fetchExamAttempts();
  }, [user?.userid, chapterId, subject, chapter]);

  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeTotal = safeQuestions.length;
  const safeCurrentIndex = Math.min(
    Math.max(currentQuestion, 0),
    Math.max(0, safeTotal - 1)
  );
  const current = safeQuestions[safeCurrentIndex];

  useEffect(() => {
    if (!loading && safeTotal > 0) {
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedOptions(Array(safeTotal).fill(null));
    }
  }, [subject, chapterId, safeTotal, loading, chapter]);

  const handleAnswerOptionClick = (answerIndex) => {
    setSelectedOptions((prev) => {
      const next = [...prev];
      next[safeCurrentIndex] = answerIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (safeCurrentIndex < safeTotal - 1) {
      setCurrentQuestion(safeCurrentIndex + 1);
    } else {
      calculateFinish();
    }
  };

  const handlePrevious = () => {
    if (safeCurrentIndex > 0) {
      setCurrentQuestion(safeCurrentIndex - 1);
    }
  };

  const calculateFinish = () => {
    let newScore = 0;
    selectedOptions.forEach((selected, index) => {
      const question = safeQuestions[index];
      if (question && selected === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowScore(true);
  };

  const handleSubmit = async () => {
    try {
      let newScore = 0;
      const user = JSON.parse(localStorage.getItem("user"));
      const answers = [];
      selectedOptions.forEach((selected, index) => {
        const question = safeQuestions[index];
        const isCorrect = question && selected === question.correctAnswer;
        if (isCorrect) newScore++;
        answers.push({
          questionIndex: question?.originalIndex ?? index, // Use original index to track the question
          selectedOption: selected,
          isCorrect,
          question: question?.question,
          correctAnswer: question?.correctAnswer,
          options: question?.options,
        });
      });

      if (user?.userid) {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/exam/results",
            {
              userId: user.userid,
              courseId: chapter
                ? `${subject}-chapter-${chapter.id}`
                : subject || category,
              score: newScore,
              totalQuestions: safeTotal,
              answers: answers,
              attemptId: attemptId, // Include attemptId for tracking
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              timeout: 10000, // 10 second timeout
            }
          );
          if (response.data.success) {
            toast.success("Exam submitted successfully!");
            // Refresh exam attempts to include the new attempt
            fetchExamAttempts();
          } else {
            toast.warning("Exam submitted but server returned an error.");
          }
        } catch (submitErr) {
          console.error("Submit Error Details:", submitErr);

          // Check if it's a network error (server not reachable)
          if (
            submitErr.code === "ECONNABORTED" ||
            submitErr.code === "ERR_NETWORK" ||
            submitErr.message?.includes("Network Error")
          ) {
            toast.error(
              "Cannot connect to server. Please check if the backend server is running on port 8000."
            );
          }
          // Check if it's a response error (server returned an error)
          else if (submitErr.response) {
            const errorMessage =
              submitErr.response?.data?.message ||
              submitErr.response?.data?.error ||
              "Server error occurred";
            toast.error(`Failed to save exam: ${errorMessage}`);
          }
          // Other errors
          else {
            toast.error(
              `Failed to save exam: ${submitErr.message || "Unknown error"}`
            );
          }
        }
      } else {
        toast.warning("User not logged in. Score calculated locally only.");
      }
      setScore(newScore);
      setShowScore(true);
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("An error occurred while submitting the exam.");
      calculateFinish();
    }
  };

  const handleRetakeSameQuestions = () => {
    // Reset the exam but keep the same questions
    setCurrentQuestion(0);
    setSelectedOptions(Array(safeTotal).fill(null));
    setShowScore(false);
    setScore(0);
  };

  const getResultFeedback = (percentage) => {
    if (percentage >= 90)
      return { emoji: "🏆", text: "Exceptional!", color: "text-emerald-500" };
    if (percentage >= 70)
      return { emoji: "🌟", text: "Great Job!", color: "text-blue-500" };
    if (percentage >= 50)
      return { emoji: "📚", text: "Good Effort!", color: "text-amber-500" };
    return { emoji: "💪", text: "Keep Practicing!", color: "text-rose-500" };
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      {/* Decorative Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-24 cursor-pointer z-50 flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-full transition-all duration-300 group shadow-2xl"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Close Exam</span>
      </button>

      <div className="w-full max-w-lg relative z-10">
        <div className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="p-6 sm:p-8">
            <header className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {chapter ? chapter.name : subject || category}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                <p className="text-indigo-300 font-bold tracking-widest uppercase text-[9px]">
                  {safeTotal} Questions
                </p>
              </div>
            </header>

            {loading ? (
              <div className="py-20 flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full" />
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-indigo-200/50 animate-pulse font-medium">
                  Preparing your exam...
                </p>
              </div>
            ) : error && safeTotal === 0 ? (
              <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <p className="text-rose-200 font-medium mb-4">{error}</p>
                <button
                  onClick={() => navigate(-1)}
                  className="text-white bg-rose-600 px-6 py-2 rounded-xl"
                >
                  Try Again Later
                </button>
              </div>
            ) : showScore ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />
                    <div className="relative w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <span className="text-6xl">
                        {getResultFeedback((score / safeTotal) * 100).emoji}
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-1">
                  {getResultFeedback((score / safeTotal) * 100).text}
                </h2>

                <div className="mt-6 p-6 rounded-2xl bg-slate-800/50 border border-white/10 shadow-inner">
                  <div className="text-indigo-300 font-bold tracking-widest uppercase text-[10px] mb-2">
                    Final Performance
                  </div>
                  <div className="text-5xl font-black text-white mb-4">
                    {score}
                    <span className="text-indigo-500/50">/</span>
                    {safeTotal}
                  </div>
                  <div className="mb-2 flex justify-between items-center text-xs font-bold">
                    <span className="text-indigo-200">Completion Score</span>
                    <span className="text-white">
                      {Math.round((score / safeTotal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-indigo-500 to-cyan-400"
                      style={{ width: `${(score / safeTotal) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRetakeSameQuestions}
                    className="flex items-center cursor-pointer justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-95"
                  >
                    <FaRedo className="text-sm" />
                    Retake Exam
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="flex items-center cursor-pointer justify-center gap-2 px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 active:scale-95"
                  >
                    <FaHome className="text-sm" />
                    Exit Exam
                  </button>
                </div>

                {/* Show exam attempts if user is logged in */}
                {user && (
                  <div className="mt-8 p-4 rounded-2xl bg-slate-800/50 border border-white/10">
                    <h4 className="text-indigo-300 font-bold tracking-widest uppercase text-[10px] mb-3">
                      YOUR EXAM HISTORY
                    </h4>
                    <div className="space-y-2">
                      {examAttempts && examAttempts.length > 0 ? (
                        examAttempts.slice(-3).map((attempt, idx) => (
                          <div
                            key={attempt.attemptNumber || idx}
                            className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                          >
                            <span className="text-sm text-indigo-200">
                              Attempt #{attempt.attemptNumber}
                            </span>
                            <div className="text-right">
                              <span className="text-white font-bold">
                                {attempt.score}%
                              </span>
                              <span
                                className={`ml-2 text-xs ${
                                  attempt.passed
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {attempt.passed ? "PASSED" : "FAILED"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-indigo-200/60 text-sm">
                          No previous attempts found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                {/* Progress Tracking */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-[10px]">
                        {safeCurrentIndex + 1}
                      </div>
                      <span className="text-indigo-100 font-bold text-xs tracking-tight">
                        Question Pool
                      </span>
                    </div>
                    <span className="text-indigo-300/60 font-mono text-[10px] leading-none">
                      {Math.round(((safeCurrentIndex + 1) / safeTotal) * 100)}%
                      PROGRESS
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{
                        width: `${((safeCurrentIndex + 1) / safeTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Body */}
                <div className="mb-8 relative">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-tight">
                    {current.question}
                  </h3>
                  <div className="space-y-3">
                    {current.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerOptionClick(index)}
                        className={`w-full relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                          selectedOptions[safeCurrentIndex] === index
                            ? "bg-indigo-600 border-indigo-400 shadow-lg transform -translate-y-0.5"
                            : "bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                              selectedOptions[safeCurrentIndex] === index
                                ? "border-white bg-white text-indigo-600 shadow-md"
                                : "border-white/10 text-indigo-200"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span
                            className={`text-sm font-bold transition-colors ${
                              selectedOptions[safeCurrentIndex] === index
                                ? "text-white"
                                : "text-indigo-50"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedOptions[safeCurrentIndex] === index
                              ? "scale-100 opacity-100 border-white"
                              : "scale-50 opacity-0"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    onClick={handlePrevious}
                    disabled={safeCurrentIndex === 0}
                    className={`flex items-center cursor-pointer gap-2 font-bold px-4 py-2 rounded-lg transition-all text-xs ${
                      safeCurrentIndex === 0
                        ? "opacity-20 cursor-not-allowed text-white"
                        : "text-indigo-200 hover:bg-white/10 active:scale-95"
                    }`}
                  >
                    <FaArrowLeft className="text-[10px]" />
                    Prev
                  </button>

                  <div className="flex gap-3">
                    {safeCurrentIndex === safeTotal - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={selectedOptions[safeCurrentIndex] === null}
                        className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaCheckCircle />
                        Finish
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={selectedOptions[safeCurrentIndex] === null}
                        className="flex cursor-pointer items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-500 hover:shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
