import React from 'react';
import { CheckCircle, XCircle, Clock, Award, TrendingUp, BookOpen } from 'lucide-react';

const ExamResults = ({ result, onBackToNavigation, onRetakeExam }) => {
  const { score, passed, totalQuestions, correctAnswers, timeSpent, topicData } = result;
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Exam Completed'}
            </h1>
            <p className="text-gray-600">
              {passed ? 'You have successfully passed the exam!' : 'Better luck next time!'}
            </p>
          </div>

          {/* Score Display */}
          <div className={`${getScoreBgColor()} rounded-2xl p-8 mb-8 text-center`}>
            <div className="text-6xl font-bold mb-2">{score}%</div>
            <div className={`text-xl font-semibold ${getScoreColor()}`}>
              {correctAnswers} out of {totalQuestions} correct
            </div>
            <div className="text-gray-600 mt-2">
              Passing score: 70%
            </div>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Subject</h3>
              <p className="text-gray-600">{topicData.subject.subjectName}</p>
              <p className="text-sm text-gray-500 mt-1">{topicData.topic.topicName}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Time Taken</h3>
              <p className="text-gray-600">{formatTime(timeSpent)}</p>
              <p className="text-sm text-gray-500 mt-1">30 minutes available</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Performance</h3>
              <p className="text-gray-600">{Math.round((correctAnswers / totalQuestions) * 100)}% accuracy</p>
              <p className="text-sm text-gray-500 mt-1">
                {passed ? 'Passed' : 'Not Passed'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Your Score</span>
              <span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  score >= 90 ? 'bg-green-500' : 
                  score >= 70 ? 'bg-blue-500' : 
                  score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(score, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>70% (Passing)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Achievement Badge */}
          {score >= 90 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-6 mb-8 text-center">
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Excellent Performance!</h3>
              <p className="text-yellow-800">You've scored 90% or higher. Outstanding work!</p>
            </div>
          )}

          {/* Answer Review */}
          {result.answers && result.answers.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Review</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {result.answers.map((answer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">Q{index + 1}</span>
                      <span className="text-sm text-gray-600 truncate max-w-md">
                        {answer.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        answer.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBackToNavigation}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Courses
            </button>
            {!passed && (
              <button
                onClick={onRetakeExam}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retake Exam
              </button>
            )}
            {passed && (
              <button
                onClick={onBackToNavigation}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Continue Learning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
