import React, { useState } from 'react';
import CourseNavigation from './CourseNavigation';
import ExamInterface from './ExamInterface';
import ExamResults from './ExamResults';

const CourseExamSystem = () => {
  const [currentView, setCurrentView] = useState('navigation'); // navigation, exam, results
  const [selectedTopicData, setSelectedTopicData] = useState(null);
  const [examResult, setExamResult] = useState(null);

  const handleTopicSelect = (topicData) => {
    if (!topicData.topic.hasExam) {
      alert('No exam available for this topic. Please select a topic with an exam.');
      return;
    }
    setSelectedTopicData(topicData);
    setCurrentView('exam');
  };

  const handleExamComplete = (result) => {
    setExamResult(result);
    setCurrentView('results');
  };

  const handleBackToNavigation = () => {
    setCurrentView('navigation');
    setSelectedTopicData(null);
    setExamResult(null);
  };

  const handleRetakeExam = () => {
    setCurrentView('exam');
  };

  const handleBackFromExam = () => {
    setCurrentView('navigation');
  };

  return (
    <div>
      {currentView === 'navigation' && (
        <CourseNavigation onTopicSelect={handleTopicSelect} />
      )}
      
      {currentView === 'exam' && selectedTopicData && (
        <ExamInterface
          topicData={selectedTopicData}
          onExamComplete={handleExamComplete}
          onBack={handleBackFromExam}
        />
      )}
      
      {currentView === 'results' && examResult && (
        <ExamResults
          result={examResult}
          onBackToNavigation={handleBackToNavigation}
          onRetakeExam={handleRetakeExam}
        />
      )}
    </div>
  );
};

export default CourseExamSystem;
