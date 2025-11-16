"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ✅ Hide navbar when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ✅ Adds spacing so content doesn’t hide behind navbar
  useEffect(() => {
  const style = document.createElement("style");
  style.textContent = `
    .page-content { padding-top: 5rem; }
    @media (max-width: 768px) {
      .page-content { padding-top: 4rem; }
    }
    body { margin: 0; padding: 0; }
  `;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white backdrop-blur-md border-b border-gray-200 shadow-md z-50 transition-transform duration-300 ${
        hideNavbar ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-3 h-16 md:h-20">
        {/* ✅ Logo */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/images/landingpage/logo.jpg"
            alt="Logo 1"
            className="h-6 md:h-10 w-auto"
          />
          <img
            src="/images/landingpage/logoo.jpg"
            alt="Logo 2"
            className="h-5 md:h-10 w-auto -ml-0.5"
          />
        </div>

        {/* ✅ Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#0A2A6C]">
          <button
            onClick={() => router.push("/buy")}
            className="hover:text-blue-700 transition"
          >
            BUY
          </button>
          <button
            onClick={() => router.push("/sell")}
            className="hover:text-blue-700 transition"
          >
            SELL
          </button>
          <button
            onClick={() => router.push("/cars")}
            className="hover:text-blue-700 transition"
          >
            CARS
          </button>
          <button
            onClick={() => router.push("/bikes/listings")}
            className="hover:text-blue-700 transition"
          >
            BIKES
          </button>
        </nav>

        {/* ✅ Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 text-[#0A2A6C] font-medium">
          <button className="hover:text-blue-700 transition">
            <FaBell size={20} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="hover:text-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="hover:text-blue-700 transition"
          >
            Register
          </button>
          <button
            onClick={() => router.push("/sell")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sell My Vehicle
          </button>
        </div>

        {/* ✅ Mobile Menu */}
        <div className="flex md:hidden items-center gap-3">
          <button className="text-[#0A2A6C] hover:text-blue-700">
            <FaBell size={20} />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#0A2A6C] hover:text-blue-700"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 space-y-3 text-[15px] font-semibold text-[#0A2A6C]">
            {[
              { label: "BUY", path: "/buy" },
              { label: "SELL", path: "/sell" },
              { label: "CARS", path: "/cars" },
              { label: "BIKES", path: "/bikes/listings" },
              { label: "LOGIN", path: "/login" },
              { label: "REGISTER", path: "/register" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.path);
                  setIsMenuOpen(false);
                }}
                className="text-left py-3 px-4 hover:bg-blue-50 rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
