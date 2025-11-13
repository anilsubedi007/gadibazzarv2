"use client";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl mb-6 text-gray-800">
          About GadiBAZZAR
        </h1>

        {/* Platform Mission */}
        <p className="text-lg text-gray-700 leading-7 mb-6">
          GadiBAZZAR is created with a mission to make vehicle buying and selling in Nepal simple, transparent and secure.
          Today, many people still rely on physical showrooms, word-of-mouth or unverified social media posts to trade vehicles.
        </p>

        <p className="text-lg text-gray-700 leading-7 mb-8">
          Nepal needs a modern, trustworthy and user-friendly online marketplace where anyone can buy or sell a car or bike confidently. 
          GadiBAZZAR is a step toward that vision.
        </p>

        {/* Founder Intro */}
        <h2 className="text-2xl mb-4 text-gray-800">
          Founder’s Story
        </h2>

        <p className="text-lg text-gray-700 leading-7 mb-4">
          I am Anil Subedi, and I am from Chitwan, Nepal. I am currently studying Bachelor of Cyber Security at RMIT 
          University in Australia. Before this, I completed a Bachelor of Business at Western Sydney University.
        </p>

        <p className="text-lg text-gray-700 leading-7 mb-4">
          Growing up in Nepal, I noticed a common problem, there was no professional or trustworthy platform for buying or 
          selling vehicles. Most transactions happened through local dealers, middlemen, or social media, where there was 
          no proper safety, pricing transparency, or reliability.
        </p>

        <p className="text-lg text-gray-700 leading-7 mb-8">
          I wanted to change that. With my interest in technology and the knowledge I gained from both business and 
          cybersecurity, I decided to build GadiBAZZAR, a platform to make vehicle trading digital, secure, and 
          accessible for everyone in Nepal.
        </p>

        {/* Thank You */}
        <div className="text-lg text-gray-700">
          <p>Thank you for visiting GadiBAZZAR.</p>
          <p>Together, let's shape the future of Nepal’s automobile marketplace.</p>
        </div>
      </div>
    </div>
  );
}
