import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const ExamInterface = ({ topicData, onExamComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && examStarted) {
      handleSubmit();
    }
  }, [timeLeft, examStarted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/exam/questions?category=${topicData.branch.branchId}&subject=${topicData.subject.subjectName}&numQuestions=10`);
      const data = await response.json();
      
      if (data.success && data.data.questions) {
        setQuestions(data.data.questions);
        setAnswers(new Array(data.data.questions.length).fill(null));
        setExamStarted(true);
      } else {
        alert('No questions available for this topic. Please try another topic.');
        onBack();
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Error loading questions. Please try again.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('User not found. Please log in again.');
        return;
      }

      // Calculate score
      let correctAnswers = 0;
      const processedAnswers = questions.map((question, index) => {
        const selectedOption = answers[index];
        const isCorrect = selectedOption === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
          questionIndex: index,
          selectedOption: selectedOption,
          isCorrect: isCorrect,
          question: question.qDesc || question.question,
          correctAnswer: question.correctAnswer,
          options: question.choices || question.options
        };
      });

      const examData = {
        userId: user.userid,
        courseId: `${topicData.course.courseId}-${topicData.branch.branchId}-${topicData.year.yearId}-${topicData.semester.semesterId}-${topicData.subject.subjectId}-${topicData.unit.unitId}-${topicData.chapter.chapterId}-${topicData.topic.topicId}`,
        score: correctAnswers,
        totalQuestions: questions.length,
        answers: processedAnswers,
        attemptId: `${user.userid}_${Date.now()}`
      };

      const response = await fetch('http://localhost:8000/api/exam/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Dispatch event to notify other components of exam submission
        window.dispatchEvent(new CustomEvent('examSubmitted', {
          detail: {
            userId: user.userid,
            courseId: examData.courseId,
            score: result.data.score,
            passed: result.data.passed,
            result: result.data
          }
        }));

        onExamComplete({
          ...result.data,
          topicData,
          timeSpent: 1800 - timeLeft
        });
      } else {
        alert('Error submitting exam. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Error submitting exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const answeredQuestions = answers.filter(answer => answer !== null).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exam Instructions</h2>
              <div className="text-left max-w-2xl mx-auto mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Exam Details:</h3>
                  <div className="space-y-2 text-blue-800">
                    <p><strong>Subject:</strong> {topicData.subject.subjectName}</p>
                    <p><strong>Unit:</strong> {topicData.unit.unitName}</p>
                    <p><strong>Chapter:</strong> {topicData.chapter.chapterName}</p>
                    <p><strong>Topic:</strong> {topicData.topic.topicName}</p>
                    <p><strong>Duration:</strong> 30 minutes</p>
                    <p><strong>Total Questions:</strong> 10</p>
                    <p><strong>Passing Score:</strong> 70%</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-900 mb-4">Instructions:</h3>
                  <ul className="space-y-2 text-yellow-800 list-disc list-inside">
                    <li>You have 30 minutes to complete the exam</li>
                    <li>All questions are multiple choice</li>
                    <li>You must answer all questions before submitting</li>
                    <li>Once submitted, you cannot change your answers</li>
                    <li>Make sure you have a stable internet connection</li>
                    <li>Do not refresh the page during the exam</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={fetchQuestions}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Exam
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {topicData.subject.subjectName} - {topicData.topic.topicName}
              </h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {questions[currentQuestion]?.qDesc || questions[currentQuestion]?.question}
              </h3>
              <div className="space-y-3">
                {(questions[currentQuestion]?.choices || questions[currentQuestion]?.options || []).map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerSelect(currentQuestion, index)}
                      className="mr-3"
                    />
                    <span className="text-gray-800">{option}</span>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[index] !== null
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answers.includes(null)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Exam
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {answers.includes(null) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">Please answer all questions before submitting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
