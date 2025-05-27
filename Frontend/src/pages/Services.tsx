import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Mic, Type, Volume2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const services = [
  {
    id: 'video-translator',
    title: 'Video Translator',
    description: 'Convert dialect-based videos to English with preserved cultural context',
    icon: Video,
    path: '/dashboard'
  },
  {
    id: 'audio-translator',
    title: 'Audio Translator',
    description: 'Transform Malayalam audio content into fluent English',
    icon: Mic,
    path: '/audio-dashboard'
  },
  {
    id: 'text-translator',
    title: 'Text Translator',
    description: 'Translate text between Malayalam and English instantly',
    icon: Type,
    path: '/text-dashboard'
  }
];

export default function Services() {
  const credits = useAuthStore((state) => state.credits);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Our Services</h1>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-purple-400" />
            <span className="text-gray-300">{credits} credits remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={service.path}
                className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}