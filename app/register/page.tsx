
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  // ✅ IMPORTANT: 'mobile' field added here
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!form.name || !form.email || !form.mobile || !form.password || !form.confirm) {
      setError("All fields are required");
    } else if (form.password !== form.confirm) {
      setError("Passwords do not match");
    } else {
      setError("");
      router.push("/"); // ✅ Redirect after success
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-36 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        {/* ✅ Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-400 p-3 rounded-lg mb-4 text-gray-800 placeholder-gray-500 focus:outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* ✅ Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-400 p-3 rounded-lg mb-4 text-gray-800 placeholder-gray-500 focus:outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* ✅ Mobile Number */}
        <input
          type="tel"
          placeholder="Mobile Number"
          className="w-full border border-gray-400 p-3 rounded-lg mb-4 text-gray-800 placeholder-gray-500 focus:outline-none"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        {/* ✅ Password */}
        <div className="relative w-full mb-4">
          <input
            id="passwordField"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-400 p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-4 top-3 text-gray-500 hover:text-blue-600"
            onMouseDown={() => document.getElementById("passwordField")?.setAttribute("type", "text")}
            onMouseUp={() => document.getElementById("passwordField")?.setAttribute("type", "password")}
            onMouseLeave={() => document.getElementById("passwordField")?.setAttribute("type", "password")}
          >
            <FaEye />
          </button>
        </div>

        {/* ✅ Confirm Password */}
        <div className="relative w-full mb-4">
          <input
            id="confirmField"
            type="password"
            placeholder="Confirm Password"
            className={`w-full border p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none ${
              form.confirm.length > 0
                ? form.password === form.confirm
                  ? "border-green-500"
                  : "border-red-500"
                : "border-gray-400"
            }`}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-4 top-3 text-gray-500 hover:text-blue-600"
            onMouseDown={() => document.getElementById("confirmField")?.setAttribute("type", "text")}
            onMouseUp={() => document.getElementById("confirmField")?.setAttribute("type", "password")}
            onMouseLeave={() => document.getElementById("confirmField")?.setAttribute("type", "password")}
          >
            <FaEye />
          </button>
        </div>

        {/* ✅ Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* ✅ Submit button */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="text-center text-sm mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
