import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from "react-icons/fa";

import { Helmet } from "react-helmet-async";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userid: z.string().min(3, "User ID must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rollno: z.string().min(1, "Roll number is required"),
  courseName: z.string().min(1, "Class name is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleForm = async (data) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/auth/register", data);
      toast.success("Registration successful! Redirecting to login...");
      reset();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      setError("root", { message: errorMessage });
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - SkillTrack</title>
        <meta
          name="Register page"
          content="Welcome to SkillTrack - Register to your account"
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-5 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gray-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-gray-300/30 rounded-full blur-[120px]" />

        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Left Sidebar - Visual branding */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-700 to-gray-900 p-8 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                  <FaUserPlus className="text-3xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Join Us</h1>
                <p className="text-gray-300/80 text-sm">
                  Unlock your potential with our advanced learning platform.
                </p>
                <div className="mt-8 space-y-4 w-full">
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Interactive Courses</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Expert Analytics</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:col-span-3 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter your details to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit(handleForm)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaUser className="text-sm" />
                        </div>
                        <input
                          {...register("name")}
                          id="name"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                            errors.name
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* User ID */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="userid"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        User ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaIdCard className="text-sm" />
                        </div>
                        <input
                          {...register("userid")}
                          id="userid"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                            errors.userid
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="johndoe123"
                        />
                      </div>
                      {errors.userid && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.userid.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <FaEnvelope className="text-sm" />
                      </div>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                          errors.email ? "border-red-500/50" : "border-gray-200"
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-400 font-medium ml-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <FaLock className="text-sm" />
                      </div>
                      <input
                        {...register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full bg-gray-50 border pl-10 pr-10 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                          errors.password
                            ? "border-red-500/50"
                            : "border-gray-200"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-sm" />
                        ) : (
                          <FaEye className="text-sm" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-red-400 font-medium ml-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Roll Number */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="rollno"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Roll Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaIdCard className="text-sm" />
                        </div>
                        <input
                          {...register("rollno")}
                          id="rollno"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                            errors.rollno
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="21BCE1234"
                        />
                      </div>
                      {errors.rollno && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.rollno.message}
                        </p>
                      )}
                    </div>

                    {/* Class Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="courseName"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Class Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaGraduationCap className="text-sm" />
                        </div>
                        <input
                          {...register("courseName")}
                          id="courseName"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition duration-200 outline-none ${
                            errors.courseName
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="B.Tech CSE"
                        />
                      </div>
                      {errors.courseName && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.courseName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 py-3 cursor-pointer px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {errors.root && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                      {errors.root.message}
                    </div>
                  )}

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
