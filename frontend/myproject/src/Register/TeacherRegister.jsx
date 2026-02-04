import React, { useState } from "react";
import apiClient from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaEnvelope,
  FaUserCircle,
  FaLock,
  FaIdCard,
  FaChalkboardTeacher,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const teacherRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().min(1, "Qualification is required"),
});

const TeacherRegister = () => {
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
    resolver: zodResolver(teacherRegisterSchema),
  });

  const handleForm = async (data) => {
    try {
      setLoading(true);
      await apiClient.post("/teacher-auth/register", data);
      toast.success("Teacher registration successful! Redirecting to login...");
      reset();
      setTimeout(() => navigate("/teacher-login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Teacher registration failed. Please try again.";
      toast.error(errorMessage);
      setError("root", { message: errorMessage });
      console.error("Teacher registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Teacher Register - SkillTrack</title>
        <meta
          name="Teacher Register page"
          content="Welcome to SkillTrack - Register as a teacher"
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-5 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-blue-300/30 rounded-full blur-[120px]" />

        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Left Sidebar - Visual branding */}
              <div className="md:col-span-2 bg-linear-to-br from-blue-700 to-blue-900 p-8 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                  <FaChalkboardTeacher className="text-3xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Join as Educator</h1>
                <p className="text-blue-200 text-sm">
                  Share your knowledge and inspire students worldwide.
                </p>
                <div className="mt-8 space-y-4 w-full">
                  <div className="flex items-center gap-3 text-blue-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Course Creation</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Student Management</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:col-span-3 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Teacher Registration
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Create your educator account
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
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.name
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="John Smith"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.name.message}
                        </p>
                      )}
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
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.email
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="john@university.edu"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Employee ID */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="employeeId"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Employee ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaIdCard className="text-sm" />
                        </div>
                        <input
                          {...register("employeeId")}
                          id="employeeId"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.employeeId
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="EMP12345"
                        />
                      </div>
                      {errors.employeeId && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.employeeId.message}
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="department"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Department
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaChalkboardTeacher className="text-sm" />
                        </div>
                        <input
                          {...register("department")}
                          id="department"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.department
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="Computer Science"
                        />
                      </div>
                      {errors.department && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.department.message}
                        </p>
                      )}
                    </div>
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
                        className={`w-full bg-gray-50 border pl-10 pr-10 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
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
                    {/* Designation */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="designation"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Designation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaUserCircle className="text-sm" />
                        </div>
                        <input
                          {...register("designation")}
                          id="designation"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.designation
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="Professor"
                        />
                      </div>
                      {errors.designation && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.designation.message}
                        </p>
                      )}
                    </div>

                    {/* Qualification */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="qualification"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1"
                      >
                        Qualification
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <FaUserCircle className="text-sm" />
                        </div>
                        <input
                          {...register("qualification")}
                          id="qualification"
                          type="text"
                          className={`w-full bg-gray-50 border pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 outline-none ${
                            errors.qualification
                              ? "border-red-500/50"
                              : "border-gray-200"
                          }`}
                          placeholder="PhD, M.Tech, etc."
                        />
                      </div>
                      {errors.qualification && (
                        <p className="text-[11px] text-red-400 font-medium ml-1">
                          {errors.qualification.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 py-3 cursor-pointer px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-lg ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Teacher Account"
                    )}
                  </button>

                  {errors.root && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                      {errors.root.message}
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/teacher-login"
                        className="font-bold text-blue-700 hover:text-blue-900 transition-colors duration-200"
                      >
                        Teacher Login
                      </Link>
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      By registering, you agree to our
                      <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">
                        Terms
                      </a>{" "}
                      and
                      <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherRegister;