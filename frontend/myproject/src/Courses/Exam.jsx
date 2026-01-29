import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiClient from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { chaptersData } from "./courseCatalog";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaRedo,
  FaHome,
  FaClock,
  FaTrophy,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

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
  // Handle both new and old question formats
  const cleaned = (Array.isArray(rawQuestions) ? rawQuestions : [])
    .filter((q) => {
      // Check for new format (qType, qDesc, choices) or old format (question, options)
      const hasNewFormat = q?.qDesc && Array.isArray(q?.choices);
      const hasOldFormat = q?.question && Array.isArray(q?.options);
      return hasNewFormat || hasOldFormat;
    })
    .map((q) => {
      // Convert to a consistent format
      if (q.qDesc && Array.isArray(q.choices)) {
        // New format - handle different correctAnswer formats
        let correctAnswer = 0; // Default to first option
        if (q.correctAnswer !== undefined) {
          correctAnswer = q.correctAnswer;
        } else if (q.correctAns !== undefined) {
          // If correctAns is the actual answer text, find its index in choices
          const answerIndex = q.choices.findIndex(choice =>
            String(choice).toLowerCase() === String(q.correctAns).toLowerCase()
          );
          correctAnswer = answerIndex !== -1 ? answerIndex : 0;
        }

        return {
          question: q.qDesc, // Use qDesc as question text
          options: q.choices, // Use choices as options
          correctAnswer: correctAnswer, // Use the determined correct answer index
          explanation: q.explanation || "", // Include explanation
          ...q, // Keep all other properties
        };
      }
      // Old format - ensure correctAnswer is a number
      return {
        ...q,
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0
      };
    });

  // Add unique IDs to questions to track them after shuffling
  const questionsWithIds = cleaned.map((q, index) => ({
    ...q,
    originalIndex: index,
    id: `${String(q.question || '').substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
  }));

  if (questionsWithIds.length > 0) return questionsWithIds;

  // Fallback to default questions if none found
  const defaultQuestions = makeDefaultChapterQuestions(fallbackTitle);
  return defaultQuestions.map((q, index) => ({
    ...q,
    originalIndex: index,
    id: `${String(q.question).substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
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
  const courseId = useMemo(
    () => (chapter ? `${subject}-chapter-${chapter.id}` : subject || category),
    [chapter, subject, category],
  );
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
    // Only create attempt database if we have all required parameters
    if (!user?.userid || !chapterId || !subject) {
      console.log("Skipping attempt database creation - missing required parameters");
      console.log("userid:", user?.userid, "chapterId:", chapterId, "subject:", subject);
      return null;
    }

    try {
      console.log("Creating attempt database with params:", {
        userId: user.userid,
        courseId: courseId,
        chapterId: chapterId,
        category: subject,
        chapterName: chapter?.name || subject || "Exam"
      });

      const response = await apiClient.post(
        "/exam/attempt-database",
        {
          userId: user.userid,
          courseId: courseId,
          chapterId: chapterId,
          category: subject,
          chapterName: chapter?.name || subject || "Exam",
        },
      );

      if (response.data.success) {
        const newAttemptId = response.data.data?.attemptId;
        if (newAttemptId) {
          setAttemptId(newAttemptId);
          console.log("Successfully created attempt database with ID:", newAttemptId);
          return newAttemptId;
        } else {
          console.warn("Attempt database created but no attemptId returned:", response.data);
          return null;
        }
      } else {
        console.warn("Attempt database creation failed:", response.data);
        return null;
      }
    } catch (err) {
      console.error("Error creating attempt database:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      // Fall back to using main database if attempt creation fails
      return null;
    }
  };

  const fetchExamAttempts = async () => {
    if (user?.userid && courseId) {
      try {
        console.log(`[Exam] Fetching results for userId: ${user.userid}, type: ${typeof user.userid}`);
        console.log(`[Exam] Current courseId:`, courseId, 'type:', typeof courseId);

        // Ensure userId is properly formatted
        const userId = user.userid?.toString?.() || user.userid;

        const response = await apiClient.get(
          `/exam/results/${userId}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );

        console.log(`[Exam] API response success:`, response.data.success);
        console.log(`[Exam] API response data:`, response.data.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          console.log(`[Exam] Received ${response.data.data.length} course results`);
          if (response.data.data.length > 0) {
            console.log(`[Exam] Course IDs in response:`, response.data.data.map(r => ({
              courseId: r.courseId,
              type: typeof r.courseId,
              examAttempts: r.examAttempts?.length || 0
            })));
          }

          // Normalize courseId for comparison (handle both string and number formats)
          const normalizedCourseId = String(courseId).toLowerCase().trim();
          console.log(`[Exam] Looking for courseId: "${normalizedCourseId}" (normalized)`);

          const courseResult = response.data.data.find((result) => {
            const resultCourseId = String(result.courseId).toLowerCase().trim();
            const matches = resultCourseId === normalizedCourseId;
            console.log(`[Exam] Checking result courseId: "${resultCourseId}" -> Match: ${matches}`);
            return matches;
          });

          if (courseResult && Array.isArray(courseResult.examAttempts)) {
            setExamAttempts(courseResult.examAttempts);
            console.log(`[Exam] Setting ${courseResult.examAttempts.length} exam attempts for courseId: ${courseId}`);
            console.log(`[Exam] Exam attempts details:`, courseResult.examAttempts);
          } else {
            console.log(`[Exam] No matching course result found for courseId: ${courseId}`);
            console.log(`[Exam] Available course IDs:`, response.data.data.map(r => r.courseId));
            setExamAttempts([]);
          }

          // Update user's localStorage with all exam results to keep it current
          try {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            if (updatedUser) {
              updatedUser.examResults = response.data.data;
              localStorage.setItem("user", JSON.stringify(updatedUser));
              console.log(`[Exam] Updated localStorage with ${response.data.data.length} course results`);
            }
          } catch (storageErr) {
            console.error("Error updating user data in localStorage:", storageErr);
          }
        } else {
          console.log(`[Exam] Response not successful or data is not an array`);
          setExamAttempts([]);
        }
      } catch (err) {
        console.error("Error fetching exam attempts:", err);
        console.error("Error details:", err.response || err.message);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        setExamAttempts([]);
      }
    } else {
      console.log(`[Exam] Skipping fetch - missing userid (${user?.userid}) or courseId (${courseId})`);
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
          const response = await apiClient.get(
            "/exam/questions",
            {
              params: {
                chapterId,
                category: subject,
                attemptId: newAttemptId, // Use the new attempt ID
              },
            },
          );
          if (
            response.data.success &&
            response.data.data?.questions?.length > 0
          ) {
            setQuestions(
              normalizeQuestions(
                response.data.data.questions,
                chapter?.name || subject || "Exam",
              ),
            );
            setLoading(false);
            return;
          } else {
            // No questions in database
            console.warn("No questions found in database for this chapter.");
            setError(
              "No questions found for this chapter in the database. Please contact support.",
            );
            setLoading(false);
            return;
          }
        }

        setError("Invalid course or chapter selection.");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(
          "Failed to connect to the server. Please check your connection.",
        );
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [chapterId, subject, chapter]);

  useEffect(() => {
    console.log(`[Exam] Fetching exam attempts for courseId: ${courseId}`);
    fetchExamAttempts();
  }, [user?.userid, courseId]);

  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeTotal = safeQuestions.length;
  const safeCurrentIndex = Math.min(
    Math.max(currentQuestion, 0),
    Math.max(0, safeTotal - 1),
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log('Submit already in progress');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let newScore = 0;
      const user = JSON.parse(localStorage.getItem("user"));
      const answers = [];
      
      // Calculate score and prepare answers
      selectedOptions.forEach((selected, index) => {
        const question = safeQuestions[index];
        const isCorrect = question && selected === question.correctAnswer;
        if (isCorrect) newScore++;
        answers.push({
          questionIndex: question?.originalIndex ?? index,
          selectedOption: selected,
          isCorrect,
          question: question?.question,
          correctAnswer: question?.correctAnswer,
          options: question?.options,
        });
      });

      if (user?.userid) {
        try {
          // Prepare the payload, making sure attemptId is only included if it exists
          const payload = {
            userId: user.userid,
            courseId: courseId,
            score: newScore,
            totalQuestions: safeTotal,
            answers: answers,
          };

          // Only add attemptId if it exists
          if (attemptId) {
            payload.attemptId = attemptId;
          }

          const response = await apiClient.post(
            "/exam/results",
            payload,
            {
              timeout: 10000, // 10 second timeout
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            }
          );

          if (response.data.success) {
            toast.success("Exam submitted successfully!");

            // Small delay to ensure the backend has processed the submission
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update user's localStorage with latest exam data immediately
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            if (updatedUser) {
              // Fetch updated exam results to ensure localStorage has the latest data
              try {
                const resultsResponse = await apiClient.get(
                  `/exam/results/${updatedUser.userid}`,
                  {
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

                  updatedUser.examResults = results;
                  localStorage.setItem("user", JSON.stringify(updatedUser));

                  // Dispatch a custom event to notify other components about the update
                  window.dispatchEvent(new CustomEvent('examSubmitted', { detail: { userId: updatedUser.userid } }));

                  // Force a complete refresh of exam attempts for this component
                  await fetchExamAttempts();
                }
              } catch (updateErr) {
                console.error("Error updating user data in localStorage:", updateErr);
                // Even if localStorage update fails, still try to refresh the UI
                await fetchExamAttempts();
              }
            }
          } else {
            toast.warning("Exam submitted but server returned an error.");
            // Still try to refresh the UI even if the response wasn't successful
            await fetchExamAttempts();
          }
        } catch (submitErr) {
          console.error("Submit Error Details:", submitErr);

          // Handle cancellation errors specifically
          if (submitErr.isCancelled) {
            console.log('Request was cancelled:', submitErr.message);
            toast.info('Previous request was cancelled. Please try submitting again.');
            return;
          }

          // Check if it's a network error
          if (
            submitErr.code === "ECONNABORTED" ||
            submitErr.code === "ERR_NETWORK" ||
            submitErr.message?.includes("Network Error")
          ) {
            toast.error(
              "Cannot connect to server. Please check your internet connection and try again.",
              { autoClose: 5000 }
            );
          }
          // Check if it's a response error
          else if (submitErr.response) {
            const errorMessage =
              submitErr.response?.data?.message ||
              submitErr.response?.data?.error ||
              "Server error occurred";
            toast.error(`Failed to save exam: ${errorMessage}`, { autoClose: 5000 });
          }
          // Other errors
          else {
            toast.error(
              `Failed to save exam: ${submitErr.message || "Unknown error"}`,
              { autoClose: 5000 }
            );
          }

          // Even if submission fails, try to refresh the data to see if anything was saved
          try {
            await fetchExamAttempts();
          } catch (refreshErr) {
            console.error("Could not refresh exam attempts after submission error:", refreshErr);
          }
        }
      } else {
        toast.warning("User not logged in. Score calculated locally only.");
      }
      
      setScore(newScore);
      setShowScore(true);
    } catch (err) {
      console.error("Unexpected error in handleSubmit:", err);
      toast.error("An unexpected error occurred. Please try again.", { autoClose: 5000 });
      calculateFinish();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeExam = async () => {
    // Reset the exam and fetch fresh random questions
    setCurrentQuestion(0);
    setSelectedOptions([]);
    setShowScore(false);
    setScore(0);
    setLoading(true);
    setError(null);

    try {
      // Create a new attempt database for this retake
      const newAttemptId = await createAttemptDatabase();

      if (chapterId && subject) {
        const response = await apiClient.get(
          "/exam/questions",
          {
            params: {
              chapterId,
              category: subject,
              attemptId: newAttemptId,
            },
          },
        );
        if (
          response.data.success &&
          response.data.data?.questions?.length > 0
        ) {
          setQuestions(
            normalizeQuestions(
              response.data.data.questions,
              chapter?.name || subject || "Exam",
            ),
          );
          setLoading(false);
          return;
        }
      }

      // Fallback to existing questions if server fails
      setLoading(false);
    } catch (err) {
      console.error("Error fetching fresh questions for retake:", err);
      setLoading(false);
      setError("Using existing questions. Server connection failed.");
    }
  };

  const getResultFeedback = (percentage) => {
    if (percentage >= 90)
      return { emoji: "🏆", text: "Exceptional!", color: "text-slate-400" };
    if (percentage >= 70)
      return { emoji: "🌟", text: "Great Job!", color: "text-slate-300" };
    if (percentage >= 50)
      return { emoji: "📚", text: "Good Effort!", color: "text-slate-500" };
    return { emoji: "💪", text: "Keep Practicing!", color: "text-slate-600" };
  };

  return (
    <>
      <Helmet>
        <title>Exam - SkillTrack</title>
        <meta
          name="Exam page"
          content="Take exams and test your knowledge on SkillTrack"
        />
      </Helmet>
      <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        {/* Decorative Background Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-700/10 rounded-full blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-slate-600/10 rounded-full blur-[120px]" />
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-700/20 rounded-full border border-slate-600/30">
                  <span className="w-1 h-1 rounded-full bg-slate-400 animate-pulse" />
                  <p className="text-slate-300 font-bold tracking-widest uppercase text-[9px]">
                    {safeTotal} Questions
                  </p>
                </div>
              </header>

              {loading ? (
                <div className="py-20 flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full" />
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-slate-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  </div>
                  <p className="mt-6 text-slate-400/50 animate-pulse font-medium">
                    Preparing your exam...
                  </p>
                </div>
              ) : error && safeTotal === 0 ? (
                <div className="p-8 text-center bg-slate-700/20 border border-slate-600/30 rounded-2xl">
                  <p className="text-slate-200 font-medium mb-4">{error}</p>
                  <button
                    onClick={() => navigate(-1)}
                    className="text-white bg-slate-600 px-6 py-2 rounded-xl"
                  >
                    Try Again Later
                  </button>
                </div>
              ) : showScore ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-600/30 blur-2xl rounded-full" />
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
                    <div className="text-slate-300 font-bold tracking-widest uppercase text-[10px] mb-2">
                      Final Performance
                    </div>
                    <div className="text-5xl font-black text-white mb-4">
                      {score}
                      <span className="text-slate-500/50">/</span>
                      {safeTotal}
                    </div>
                    <div className="mb-2 flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-300">Completion Score</span>
                      <span className="text-white">
                        {Math.round((score / safeTotal) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-slate-600 to-slate-400"
                        style={{ width: `${(score / safeTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleRetakeExam}
                      className="flex items-center cursor-pointer justify-center gap-2 px-8 py-3 bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-600 transition-all duration-300 shadow-xl shadow-slate-700/20 active:scale-95"
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
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-slate-300 font-bold tracking-widest uppercase text-[10px]">
                          YOUR EXAM HISTORY
                        </h4>
                        {examAttempts && examAttempts.length > 0 && (
                          <button
                            onClick={() =>
                              navigate(
                                `/performance/${encodeURIComponent(courseId)}`,
                              )
                            }
                            className="text-xs font-bold px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center gap-1"
                          >
                            View All
                            <FaArrowLeft className="rotate-180 text-[8px]" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {examAttempts && examAttempts.length > 0 ? (
                          examAttempts.slice(-3).map((attempt, idx) => (
                            <div
                              key={attempt.attemptNumber || idx}
                              className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                            >
                              <span className="text-sm text-slate-300">
                                Attempt #{attempt.attemptNumber}
                              </span>
                              <div className="text-right">
                                <span className="text-white font-bold">
                                  {attempt.score}%
                                </span>
                                <span
                                  className={`ml-2 text-xs ${attempt.passed
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                    }`}
                                >
                                  {attempt.passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400/60 text-sm">
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
                        <div className="w-6 h-6 rounded-md bg-slate-700/30 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                          {safeCurrentIndex + 1}
                        </div>
                        <span className="text-slate-200 font-bold text-xs tracking-tight">
                          Question Pool
                        </span>
                      </div>
                      <span className="text-slate-400/60 font-mono text-[10px] leading-none">
                        {Math.round(((safeCurrentIndex + 1) / safeTotal) * 100)}
                        % PROGRESS
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-600 to-slate-400 transition-all duration-500"
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
                          className={`w-full relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${selectedOptions[safeCurrentIndex] === index
                            ? "bg-slate-700 border-slate-500 shadow-lg transform -translate-y-0.5"
                            : "bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${selectedOptions[safeCurrentIndex] === index
                                ? "border-white bg-white text-slate-800 shadow-md"
                                : "border-white/10 text-slate-300"
                                }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span
                              className={`text-sm font-bold transition-colors ${selectedOptions[safeCurrentIndex] === index
                                ? "text-white"
                                : "text-slate-100"
                                }`}
                            >
                              {option}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedOptions[safeCurrentIndex] === index
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
                      className={`flex items-center cursor-pointer gap-2 font-bold px-4 py-2 rounded-lg transition-all text-xs ${safeCurrentIndex === 0
                        ? "opacity-20 cursor-not-allowed text-white"
                        : "text-slate-200 hover:bg-slate-700/20 active:scale-95"
                        }`}
                    >
                      <FaArrowLeft className="text-[10px]" />
                      Prev
                    </button>

                    <div className="flex gap-3">
                      {safeCurrentIndex === safeTotal - 1 ? (
                        <button
                          onClick={handleSubmit}
                          disabled={selectedOptions[safeCurrentIndex] === null || isSubmitting}
                          className={`flex items-center gap-2 font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all text-xs active:scale-95 ${
                            selectedOptions[safeCurrentIndex] === null || isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-slate-600 to-slate-500 cursor-pointer text-white'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="inline-block animate-spin">⟳</span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="text-sm" />
                              Submit Exam
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          disabled={selectedOptions[safeCurrentIndex] === null}
                          className="flex cursor-pointer items-center gap-2 bg-slate-700 text-white font-bold px-6 py-2 rounded-xl hover:bg-slate-600 hover:shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default Exam;
