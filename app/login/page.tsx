"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    // TEMP LOGIN CHECK (replace with actual backend/auth later)
    if (email === "test@gmail.com" && password === "123456") {
      setError("");
      router.push("/"); // ✅ Redirect to Home page on success
    } else {
      setError("Invalid email or password"); // ✅ Error message
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-48 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        
        {/* ✅ Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to GadiBAZZAR
        </h2>

        {/* ✅ Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-400 p-3 rounded-lg mb-4 focus:outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Password with Hold-to-Show Effect */}
        <div className="relative w-full mb-6">
        <input
    id="passwordField"
    type="password"
    placeholder="Password"
    className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* 👁 Hold to Show / Release to Hide */}
  <button
    type="button"
    className="absolute right-4 top-3 text-gray-500 hover:text-blue-600"
    onMouseDown={() => {
      const input = document.getElementById("passwordField") as HTMLInputElement;
      input.type = "text";
    }}
    onMouseUp={() => {
      const input = document.getElementById("passwordField") as HTMLInputElement;
      input.type = "password";
    }}
    onMouseLeave={() => {
      const input = document.getElementById("passwordField") as HTMLInputElement;
      input.type = "password";
    }}
  >
    <FaEye />
  </button>
</div>


        {/* ✅ Error Message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* ✅ Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* ✅ Forgot Password */}
        <p
          className="text-center text-sm text-blue-600 mt-3 cursor-pointer hover:underline"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </p>

        {/* ✅ Register Redirect */}
        <p className="text-center text-sm mt-4 text-gray-700">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
