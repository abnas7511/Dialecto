import React from 'react';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';

interface VideoComparisonProps {
  originalVideo: string | null;
  translatedVideo: string | null;
  translatedAudio: string | null;
}

export default function VideoComparison({
  originalVideo,
  translatedVideo,
  translatedAudio,
}: VideoComparisonProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 space-y-6 border border-purple-500/20">
      <h2 className="text-xl font-semibold text-white">Translation Results</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Original Content
            </h3>
            <div className="flex items-center gap-2 text-purple-400">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Dialect Malayalam</span>
            </div>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {originalVideo ? (
              <video
                className="w-full h-full object-contain"
                controls
                src={originalVideo}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No original video available
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/20">
            <h3 className="text-sm font-medium text-white mb-2">Original Audio</h3>
            <audio
              className="w-full"
              controls
              src={originalVideo || undefined}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              {translatedVideo ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              Translated Content
            </h3>
            <div className="flex items-center gap-2 text-purple-400">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">English</span>
            </div>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {translatedVideo ? (
              <video
                className="w-full h-full object-contain"
                controls
                src={translatedVideo}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Translation pending
              </div>
            )}
          </div>

          {translatedAudio && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/20">
              <h3 className="text-sm font-medium text-white mb-2">Translated Audio</h3>
              <audio
                className="w-full"
                controls
                src={translatedAudio}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}