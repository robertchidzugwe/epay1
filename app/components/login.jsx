"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as FaIcons from "react-icons/fa";
import axios from "axios";

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    const payload = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };
  
    try {
      const response = await axios.post(
        "https://kwale-hris-api.onrender.com/proxy/authenticate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
  
      const data = response.data;
      console.log("API Response:", data);
  
      if (data?.responsecode === "1111") {
        localStorage.setItem("userid", data.userid);
        localStorage.setItem("employeename", data.employeename);
        localStorage.setItem("admin_phone", data.admin_phone);
        router.push("/QueryForm");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10">
        <div className="flex justify-center mb-6">
          <img src="logo.jpeg" alt="Company Logo" className="w-24 h-24 object-contain" />
        </div>
        <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <FaIcons.FaUser className="absolute right-4 top-4 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? <FaIcons.FaEyeSlash /> : <FaIcons.FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-700 mt-6 font-semibold">Powered by Kwale County Government</p>
      </div>
    </div>
  );
}
