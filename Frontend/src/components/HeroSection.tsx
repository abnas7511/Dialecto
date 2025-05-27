import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Crown } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?auto=format&fit=crop&w=2000&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-purple-900/90 to-indigo-950/90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Break Language Barriers
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your rural dialect videos into crystal-clear English content. 
            Preserve cultural authenticity while reaching a global audience.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-purple-400 border border-purple-400 hover:bg-purple-400/10"
            >
              View Pricing
              <Crown className="ml-2 h-5 w-5" />
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">99%</div>
              <div className="text-sm sm:text-base text-gray-300">Accuracy Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">25+</div>
              <div className="text-sm sm:text-base text-gray-300">Rural Dialects</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">2M+</div>
              <div className="text-sm sm:text-base text-gray-300">Minutes Processed</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">50k+</div>
              <div className="text-sm sm:text-base text-gray-300">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}