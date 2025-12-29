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
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/viewcourses" element={<Viewcourses />} />
        <Route path="/courses/:category/*" element={<CoursesWithExam />} />
        <Route path="/performance/:category" element={<Performance />} />
        <Route path="/performance/overall" element={<Performance />} />
      </Routes>
    </>
  );
};

export default App;
