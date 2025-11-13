import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "GadiBAZZAR",
  description: "Buy and sell cars and bikes across Nepal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {/* ✅ Global Navbar */}
        <Navbar />

        {/* ✅ Main Content */}
        <main className="page-content min-h-screen">
          {children}
        </main>

        {/* ✅ Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
