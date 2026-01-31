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
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
        <Route path="/viewcourses" element={<DashboardLayout><Viewcourses /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/courses/:category/*" element={<DashboardLayout><CoursesWithExam /></DashboardLayout>} />
        <Route path="/performance/overall" element={<DashboardLayout><Performance /></DashboardLayout>} />
        <Route path="/performance/:category" element={<DashboardLayout><Performance /></DashboardLayout>} />
      </Routes>
    </>
  );
};

export default App;
