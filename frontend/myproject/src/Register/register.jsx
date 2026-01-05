import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userid: z.string().min(3, "User ID must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rollno: z.string().min(1, "Roll number is required"),
  courseName: z.string().min(1, "Class name is required")
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
    reset
  } = useForm({
    resolver: zodResolver(registerSchema)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white mt-20 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-blue-100 mt-2">Join our community today</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(handleForm)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="userid"
                    className="text-sm font-medium text-gray-700"
                  >
                    User ID
                  </label>
                  <input
                    {...register("userid")}
                    id="userid"
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      errors.userid ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="johndoe123"
                  />
                  {errors.userid && (
                    <p className="text-sm text-red-600">{errors.userid.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-2.5 pr-10 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="rollno"
                    className="text-sm font-medium text-gray-700"
                  >
                    Roll Number
                  </label>
                  <input
                    {...register("rollno")}
                    id="rollno"
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      errors.rollno ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="21BCE1234"
                  />
                  {errors.rollno && (
                    <p className="text-sm text-red-600">{errors.rollno.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="courseName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Class Name
                  </label>
                  <input
                    {...register("courseName")}
                    id="courseName"
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      errors.courseName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="B.Tech CSE"
                  />
                  {errors.courseName && (
                    <p className="text-sm text-red-600">{errors.courseName.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 cursor-pointer px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-indigo-200"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.root.message}
                </div>
              )}

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms and Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
