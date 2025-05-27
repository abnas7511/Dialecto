import React from 'react';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import ContactSection from '../components/ContactSection';
import PricingSection from '../components/PricingSection';
import { Brain, Globe2, Languages, Shield, Laptop2, CloudCog } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-16">
          Why Choose Dialecto?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <Brain className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Advanced AI Technology
            </h3>
            <p className="text-gray-300">
              State-of-the-art deep learning models trained on diverse rural dialects for unmatched accuracy
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <Languages className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Dialect Preservation
            </h3>
            <p className="text-gray-300">
              Maintains the cultural nuances and emotional essence of regional dialects
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <Globe2 className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Natural Translation
            </h3>
            <p className="text-gray-300">
              Context-aware translations that sound natural and maintain the original message
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Laptop2 className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Upload Video</h3>
              <p className="text-gray-300">
                Upload your video content with rural dialect audio through our intuitive interface
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. AI Processing</h3>
              <p className="text-gray-300">
                Our AI analyzes and translates the audio while preserving the original context
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CloudCog className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Get Results</h3>
              <p className="text-gray-300">
                Download your video with perfectly translated English audio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Team Section */}
      <TeamSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}