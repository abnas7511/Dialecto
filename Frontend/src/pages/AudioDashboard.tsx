import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Loader2, Volume2, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import BackButton from '../components/BackButton';

export default function AudioDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { credits } = useAuthStore();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const maxRetries = 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,  // Force mono recording
          sampleRate: 48000,
          sampleSize: 16,
        } 
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File([blob], 'recorded-audio.wav', { type: 'audio/wav' });
        setFile(audioFile);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const checkServer = async () => {
    try {
      const response = await fetch('http://localhost:5003/health', { 
        method: 'GET',
        mode: 'cors'
      });
      setServerStatus(response.ok ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  const handleTranslate = async () => {
    if (!file || credits <= 0) return;
    if (serverStatus === 'offline') {
      setError('Server is not accessible. Please ensure the backend server is running.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    let retries = 0;
    while (retries < maxRetries) {
      try {
        const formData = new FormData();
        formData.append('audio', file);

        const response = await fetch('http://localhost:5003/translate-audio', {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation failed');
        }

        const data = await response.json();
        if (!data.audioUrl || !data.text) {
          throw new Error('Invalid response from server');
        }

        setTranslatedAudioUrl(data.audioUrl);
        setTranslatedText(data.text);
        return; // Success, exit retry loop
      } catch (err) {
        retries++;
        if (retries === maxRetries) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Connection failed. Please check if the server is running on http://localhost:5003';
          setError(errorMessage);
          console.error('Translation error details:', err);
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Audio Translation Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">{credits} credits remaining</span>
            </div>
          </div>

          <div className="space-y-6">
            {serverStatus === 'offline' && (
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
                Backend server is not accessible. Please ensure it's running on http://localhost:5000
              </div>
            )}
            <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-purple-400 mb-4" />
                <span className="text-sm sm:text-base text-gray-300">
                  {file ? file.name : 'Drop your audio file here or click to browse'}
                </span>
                <p className="mt-2 text-xs text-gray-400">
                  Supported formats: WAV, MP3, M4A (max 50MB)
                </p>
              </label>
            </div>

            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Processing audio...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-purple-900/20 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-600/50 text-white rounded-lg hover:bg-purple-700/50 transition-colors"
              >
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {isRecording ? 'Stop Recording' : 'Record Audio'}
              </button>

              <button
                onClick={handleTranslate}
                disabled={!file || isProcessing || credits <= 0}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Processing
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Translate Audio
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {(translatedAudioUrl || translatedText) && (
              <div className="mt-6 space-y-4">
                {translatedText && (
                  <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                    <h3 className="text-white mb-2">Translated Text</h3>
                    <p className="text-gray-300">{translatedText}</p>
                  </div>
                )}
                
                {translatedAudioUrl && (
                  <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                    <h3 className="text-white mb-2">Translated Audio</h3>
                    <audio controls className="w-full" src={translatedAudioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}