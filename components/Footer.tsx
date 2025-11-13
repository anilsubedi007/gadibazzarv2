"use client";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 py-6">
      <div className="max-w-8xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ✅ Logo + Tagline */}
        <div>
          <div className="flex items-start gap-2">
            <img src="/images/landingpage/logo.jpg" alt="Logo" className="h-10 w-auto" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Buy and sell cars and bikes across Nepal.
          </p>
        </div>

        {/* ✅ Quick Links */}
        <div>
          <h3 className="text-lg mb-2 text-gray-800">Quick Links</h3>
          <ul className="grid grid-cols-3 gap-y-1 gap-x-3 text-gray-600 text-sm">
            <li><a href="/cars" className="hover:text-blue-700">Cars</a></li>
            <li><a href="/bikes/listings" className="hover:text-blue-700">Bikes</a></li>
            <li><a href="/sell" className="hover:text-blue-700">Sell</a></li>
            <li><a href="/about" className="hover:text-blue-700">About</a></li>
            <li><a href="/contact" className="hover:text-blue-700">Contact</a></li>
            <li><a href="/terms" className="hover:text-blue-700">Terms</a></li>
          </ul>
        </div>

        {/* ✅ Contact */}
        <div>
          <h3 className="text-lg mb-2 text-gray-800">Contact</h3>
          <p className="text-sm text-gray-600">📧 support@gadibazzar.com</p>
          <p className="text-sm text-gray-600">📍 Chitwan, Nepal</p>
        </div>
      </div>

      {/* ✅ Bottom Line */}
      <div className="text-center pt-3 text-sm text-gray-500 border-t mt-6">
        © {new Date().getFullYear()} GadiBAZZAR. All rights reserved.
      </div>
    </footer>
  );
}
