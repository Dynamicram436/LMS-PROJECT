import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Obj = Object.fromEntries(formData.entries());

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/auth/register", Obj);
      toast.success("Registration successful! Redirecting to login...");
      e.target.reset();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
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
            <form onSubmit={handleForm} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="userid"
                    className="text-sm font-medium text-gray-700"
                  >
                    User ID
                  </label>
                  <input
                    id="userid"
                    name="userid"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="johndoe123"
                  />
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
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
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
                    id="rollno"
                    name="rollno"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="21BCE1234"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="courseName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Class Name
                  </label>
                  <input
                    id="courseName"
                    name="courseName"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="B.Tech CSE"
                  />
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
