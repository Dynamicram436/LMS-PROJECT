import React, { useEffect, useState } from "react";
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
  FaBook,
  FaGraduationCap,
  FaChartLine,
  FaUser,
  FaListOl,
  FaStar,
  FaMedal,
  FaClipboardList
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

// Helper functions
const getResultFeedback = (percentage) => {
  if (percentage >= 90) return { text: "Excellent!", emoji: "🏆" };
  if (percentage >= 80) return { text: "Great Job!", emoji: "🌟" };
  if (percentage >= 70) return { text: "Good Work!", emoji: "👍" };
  if (percentage >= 60) return { text: "Fair", emoji: "😊" };
  return { text: "Needs Improvement", emoji: "💪" };
};

const Exam = () => {
  const navigate = useNavigate();
  const { category: routeCategory } = useParams(); // Get category from route params
  const courseId = routeCategory; // Use route category as courseId
  const [searchParams] = useSearchParams();
  
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [examAttempts, setExamAttempts] = useState([]);
  
  // Extract parameters
  const searchCategory = searchParams.get("category") || "";
  const subject = searchParams.get("subject") || "";
  

  
  const chapter = chaptersData.find(ch => ch.id === courseId);
  
  // Safe navigation helpers
  const safeCurrentIndex = Math.max(0, Math.min(currentQuestionIndex, questions.length - 1));
  const safeTotal = Math.max(1, questions.length);
  

  
  // Get current question and normalize format
  const getCurrentQuestion = () => {
    const q = questions[safeCurrentIndex];
    if (!q) return { question: "", options: [], answer: 0 };
    
    // Handle both old format (question, options, correctAnswer) and new format (qDesc, choices, correctAns)
    if (q.question && q.options) {
      // Old format
      return {
        question: q.question,
        options: q.options,
        answer: q.correctAnswer
      };
    } else if (q.qDesc && q.choices) {
      // New format
      const correctIndex = q.choices.indexOf(q.correctAns);
      return {
        question: q.qDesc,
        options: q.choices,
        answer: correctIndex >= 0 ? correctIndex : 0
      };
    }
    
    // Fallback
    return { question: "", options: [], answer: 0 };
  };
  
  const current = getCurrentQuestion();
  
  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch questions
        const questionResponse = await apiClient.get(`/exam/questions/${courseId}`, {
          timeout: 10000, // 10 second timeout
        });
        
        // Check if response has the expected structure
        if (!questionResponse.data) {
          setError('Invalid response from server');
          return;
        }
        
        // Check success flag
        if (!questionResponse.data.success) {
          setError(questionResponse.data.message || 'Failed to fetch questions');
          return;
        }
        
        const fetchedQuestions = questionResponse.data.data?.questions || questionResponse.data.questions || [];
        
        if (fetchedQuestions.length === 0) {
          setError("No questions available for this exam.");
          return;
        }
        
        setQuestions(fetchedQuestions);
        
        // Fetch user data if logged in
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userResponse = await apiClient.get("/auth/profile");
            setUser(userResponse.data.user);
            
            // Fetch exam history
            const historyResponse = await apiClient.get(`/exam/history/${courseId}`);
            setExamAttempts(historyResponse.data.attempts || []);
          } catch {
            console.log("User not authenticated or error fetching user data");
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load exam. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchExamData();
    } else {
      setError("Invalid course ID");
      setLoading(false);
    }
  }, [courseId]);
  
  // Handle answer selection
  const handleAnswerOptionClick = (selectedIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [safeCurrentIndex]: selectedIndex
    }));
  };
  
  // Navigation handlers
  const handleNext = () => {
    if (safeCurrentIndex < safeTotal - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (safeCurrentIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Submit exam
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        // Handle both old and new question formats
        let correctAnswerIndex;
        if (question.correctAnswer !== undefined) {
          // Old format
          correctAnswerIndex = question.correctAnswer;
        } else if (question.correctAns && question.choices) {
          // New format
          correctAnswerIndex = question.choices.indexOf(question.correctAns);
        } else {
          // Fallback
          correctAnswerIndex = 0;
        }
        
        if (selectedOptions[index] === correctAnswerIndex) {
          correctAnswers++;
        }
      });
      
      const calculatedScore = correctAnswers;
      setScore(calculatedScore);
      
      // Save attempt if user is logged in
      if (user) {
        try {
          // Format answers for backend
          const formattedAnswers = questions.map((question, index) => {
            // Determine correct answer index
            let correctAnswerIndex;
            if (question.correctAnswer !== undefined) {
              // Old format
              correctAnswerIndex = question.correctAnswer;
            } else if (question.correctAns && question.choices) {
              // New format
              correctAnswerIndex = question.choices.indexOf(question.correctAns);
            } else {
              // Fallback
              correctAnswerIndex = 0;
            }
            
            // Determine if user's answer is correct
            const userSelectedOption = selectedOptions[index];
            const isCorrect = userSelectedOption === correctAnswerIndex;
            
            // Get question text and options
            const questionText = question.qDesc || question.question || `Question ${index + 1}`;
            const options = question.choices || question.options || [];
            
            return {
              questionIndex: index,
              question: questionText,
              options: options,
              selectedOption: userSelectedOption,
              correctAnswer: correctAnswerIndex,
              isCorrect: isCorrect,
            };
          });
          
          const attemptData = {
            userId: user.userid, // Add userId
            courseId,
            score: calculatedScore, // Send raw score (number of correct answers)
            totalQuestions: questions.length,
            answers: formattedAnswers,
            attemptId: `${user.userid}_${courseId}_${Date.now()}` // Unique attempt ID
          };
          
          await apiClient.post('/exam/results', attemptData);
          
          // Refresh exam history
          const historyResponse = await apiClient.get(`/exam/history/${courseId}`);
          setExamAttempts(historyResponse.data.attempts || []);
        } catch (saveError) {
          console.error('Error saving exam attempt:', saveError);
          toast.error('Could not save your exam results');
        }
      }
      
      setShowScore(true);
      toast.success(`Exam completed! Score: ${calculatedScore}/${questions.length}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      toast.error('Error submitting exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Retake exam
  const handleRetakeExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setShowScore(false);
    setScore(0);
    setIsSubmitting(false);
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
      
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mr-6"
              >
                <FaArrowLeft className="text-sm" />
                <span className="font-medium text-sm">Back to Course</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {chapter ? chapter.name : subject || searchCategory || courseId}
                  </h1>
                  <p className="text-xs text-gray-500">Exam Assessment</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaListOl className="text-gray-400" />
                <span className="font-medium">{safeTotal} Questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-gray-400" />
                <span>Timed Exam</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{safeCurrentIndex + 1}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Question {safeCurrentIndex + 1} of {safeTotal}</span>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(((safeCurrentIndex + 1) / safeTotal) * 100)}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((safeCurrentIndex + 1) / safeTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Exam</h3>
              <p className="text-gray-500">Preparing your assessment questions...</p>
            </div>
          </div>
        ) : error && safeTotal === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Exam</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return to Course
            </button>
          </div>
        ) : showScore ? (
          <div className="space-y-6">
            {/* Results Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">
                    {getResultFeedback((score / safeTotal) * 100).emoji}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {getResultFeedback((score / safeTotal) * 100).text}
                </h2>
                <p className="text-blue-100">Exam Completed Successfully</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{score}/{safeTotal}</div>
                    <div className="text-sm text-gray-500">Correct Answers</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((score / safeTotal) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getResultFeedback((score / safeTotal) * 100).text}
                    </div>
                    <div className="text-sm text-gray-500">Performance</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetakeExam}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaRedo className="text-sm" />
                    Retake Exam
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaHome className="text-sm" />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Exam History */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Your Exam History</h3>
                  {examAttempts && examAttempts.length > 0 && (
                    <button
                      onClick={() => navigate(`/performance/${encodeURIComponent(courseId)}`)}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                    >
                      View All Attempts
                    </button>
                  )}
                </div>
                
                {examAttempts && examAttempts.length > 0 ? (
                  <div className="space-y-3">
                    {examAttempts.slice(-3).map((attempt, idx) => (
                      <div key={attempt.attemptNumber || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${attempt.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                            {attempt.passed ? (
                              <FaCheck className="text-green-600 text-xs" />
                            ) : (
                              <FaTimes className="text-red-600 text-xs" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Attempt #{attempt.attemptNumber}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(attempt.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {attempt.score}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {attempt.passed ? 'PASSED' : 'FAILED'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaClipboardList className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500">No previous attempts found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaQuestionCircle className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Question {safeCurrentIndex + 1}</h2>
              </div>
              <p className="text-gray-600">{current.question}</p>
            </div>
            
            {/* Options */}
            <div className="p-6">
              <div className="space-y-3">
                {current.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedOptions[safeCurrentIndex] === index
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        selectedOptions[safeCurrentIndex] === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-gray-900">{option}</span>
                      {selectedOptions[safeCurrentIndex] === index && (
                        <div className="ml-auto">
                          <FaCheck className="text-blue-500" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={safeCurrentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    safeCurrentIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaArrowLeft className="text-sm" />
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {safeCurrentIndex === safeTotal - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={selectedOptions[safeCurrentIndex] === null || isSubmitting}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedOptions[safeCurrentIndex] === null || isSubmitting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
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
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedOptions[safeCurrentIndex] === null
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Next
                      <FaArrowLeft className="text-sm rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Exam;
