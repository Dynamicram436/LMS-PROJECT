import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaGraduationCap } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role, action) => {
    if (role === 'student') {
      if (action === 'login') {
        navigate('/login');
      } else {
        navigate('/register');
      }
    } else if (role === 'teacher') {
      if (action === 'login') {
        navigate('/teacher-login');
      } else {
        navigate('/teacher-register');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <FaGraduationCap className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to SkillTrack LMS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to begin your learning journey or teaching experience
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
            <div className="p-8 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserGraduate className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
              <p className="text-gray-600 mb-6">
                Access courses, take exams, track your progress, and enhance your skills
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelection('student', 'login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                  Student Login
                </button>
                <button
                  onClick={() => handleRoleSelection('student', 'register')}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                  Register as Student
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200">
            <div className="p-8 text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChalkboardTeacher className="text-purple-600 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Teacher</h3>
              <p className="text-gray-600 mb-6">
                Create courses, manage students, upload content, and monitor progress
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelection('teacher', 'login')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                  Teacher Login
                </button>
                <button
                  onClick={() => handleRoleSelection('teacher', 'register')}
                  className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                  Register as Teacher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Comprehensive Learning</h4>
            <p className="text-gray-600 text-sm">Access diverse courses and learning materials</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
            <p className="text-gray-600 text-sm">Monitor your learning journey and achievements</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
            <p className="text-gray-600 text-sm">Earn certificates upon course completion</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Select your role above to get started with your personalized experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;