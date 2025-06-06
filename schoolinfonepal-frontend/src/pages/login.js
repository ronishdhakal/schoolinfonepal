"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { loginSuperadmin, saveAuthToken } from "../utils/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginSuperadmin(form.email, form.password);
      console.log("Login successful:", data);

      // ✅ Save both tokens here
      saveAuthToken(data.access, data.refresh);

      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.role === "school") {
          window.location.href = "/dashboard/school";
        } else {
          setError("You are not authorized to access the dashboard.");
          setLoading(false);
        }
      }, 100);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed.");
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 text-xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Admin Panel</h1>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">Login</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">Access your dashboard</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center space-x-2 text-gray-600 text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
