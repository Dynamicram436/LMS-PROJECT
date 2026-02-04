import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Register/register";
import Login from "./Login/login";
import { CoursesWithExam } from "./Courses/coursesvideos";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Viewcourses from "./Courses/Viewcourses";
import Performance from "./Components/Performance";
import DashboardLayout from "./Components/DashboardLayout";
import Profile from "./Components/Profile";
import ExamSelection from "./Courses/ExamSelection";
import CourseExamSystem from "./Components/CourseExamSystem";
import DebugExamData from "./Components/DebugExamData";
import DebugExamResults from "./Components/DebugExamResults";
import BackendTest from "./Components/BackendTest";
import ManualExamTest from "./Components/ManualExamTest";
import TeacherLogin from "./Login/TeacherLogin";
import TeacherRegister from "./Register/TeacherRegister";
import LandingPage from "./Components/LandingPage";
import TeacherDashboard from "./Components/TeacherDashboard";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
        <Route path="/viewcourses" element={<DashboardLayout><Viewcourses /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/exam-selection" element={<DashboardLayout><ExamSelection /></DashboardLayout>} />
        <Route path="/course-exam" element={<DashboardLayout><CourseExamSystem /></DashboardLayout>} />
        <Route path="/courses/:category/*" element={<DashboardLayout><CoursesWithExam /></DashboardLayout>} />
        <Route path="/performance/overall" element={<DashboardLayout><Performance /></DashboardLayout>} />
        <Route path="/performance/all" element={<DashboardLayout><Performance /></DashboardLayout>} />
        <Route path="/performance/:category" element={<DashboardLayout><Performance /></DashboardLayout>} />
        <Route path="/debug-exam" element={<DashboardLayout><DebugExamData /></DashboardLayout>} />
        <Route path="/debug-results" element={<DashboardLayout><DebugExamResults /></DashboardLayout>} />
        <Route path="/test-backend" element={<DashboardLayout><BackendTest /></DashboardLayout>} />
        <Route path="/manual-test" element={<DashboardLayout><ManualExamTest /></DashboardLayout>} />
        <Route path='/teacher-login' element={<TeacherLogin />} />
        <Route path='/teacher-register' element={<TeacherRegister />} />
        <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
        
      </Routes>
    </>
  );
};

export default App;