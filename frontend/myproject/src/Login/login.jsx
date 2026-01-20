import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaIdCard,
  FaSignInAlt
} from "react-icons/fa";

const loginSchema = z.object({
  userid: z.string().min(1, "User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleForm = (data) => {
    setLoading(true);

    axios
      .post("http://localhost:8000/api/auth/login", data)
      .then((res) => {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("user", JSON.stringify(res.data.data));
        setLoading(false);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
        setError("root", { message: errorMessage });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Sidebar - Visual branding */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                <FaUserCircle className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
              <p className="text-indigo-100/80 text-sm">
                Sign in to continue your learning journey.
              </p>
              <div className="mt-8 space-y-4 w-full">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                  <span>Personalized Learning</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                  <span>Real-time Progress</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-8">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <p className="text-slate-400 text-sm">Access your account dashboard</p>
              </div>

              <form onSubmit={handleSubmit(handleForm)} className="space-y-5">
                {/* User ID */}
                <div className="space-y-1.5">
                  <label htmlFor="userid" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FaIdCard className="text-sm" />
                    </div>
                    <input
                      {...register("userid")}
                      id="userid"
                      type="text"
                      className={`w-full bg-slate-900/50 border pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-200 outline-none ${errors.userid ? "border-red-500/50" : "border-white/10"
                        }`}
                      placeholder="Enter your user ID"
                    />
                  </div>
                  {errors.userid && (
                    <p className="text-[11px] text-red-400 font-medium ml-1">{errors.userid.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FaLock className="text-sm" />
                    </div>
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full bg-slate-900/50 border pl-10 pr-10 py-2.5 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-200 outline-none ${errors.password ? "border-red-500/50" : "border-white/10"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-400 font-medium ml-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 cursor-pointer px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center space-x-2 ${loading
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40"
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="text-sm" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

                {errors.root && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                    {errors.root.message}
                  </div>
                )}
              </form>

              <div className="mt-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <span className="relative px-3 bg-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-widest rounded-full">
                    Or join us
                  </span>
                </div>

                <Link
                  to="/"
                  className="w-full mt-6 flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our
            <a href="#" className="text-indigo-400 hover:text-indigo-300 ml-1">Terms</a> and
            <a href="#" className="text-indigo-400 hover:text-indigo-300 ml-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
