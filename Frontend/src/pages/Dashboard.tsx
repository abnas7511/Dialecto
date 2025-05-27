import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Loader2, Volume2, Camera, Languages, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import BackButton from '../components/BackButton';
import VideoComparison from '../components/VideoComparison';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalVideo, setOriginalVideo] = useState<string | null>(null);
  const [translatedVideo, setTranslatedVideo] = useState<string | null>(null);
  const [translatedAudio, setTranslatedAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedDialect, setSelectedDialect] = useState<string>('malappuram');
  const [jobId, setJobId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { credits, decrementCredits } = useAuthStore();

  const dialects = [
    { id: 'malappuram', name: 'Malappuram' },
    { id: 'thrissur', name: 'Thrissur' },
    { id: 'kozhikode', name: 'Kozhikode' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFile(file);
      setOriginalVideo(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost:8000/api/v1/upload-video', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setJobId(data.job_id);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const startTranslation = async () => {
    if (!jobId || !selectedDialect) return;

    setIsProcessing(true);
    decrementCredits();

    try {
      await fetch(`http://localhost:8000/api/v1/start-translation/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dialect: selectedDialect }),
      });

      const pollStatus = async () => {
        const response = await fetch(`http://localhost:8000/api/v1/status/${jobId}`);
        const status = await response.json();
        
        if (status.status === 'completed') {
          setTranslatedVideo(`http://localhost:8000/api/v1/download/translated_video/${jobId}`);
          setTranslatedAudio(`http://localhost:8000/api/v1/download/translated_audio/${jobId}`);
          setIsProcessing(false);
          setProgress(100);
          setTimeout(() => setProgress(0), 1000);
        } else if (status.status === 'failed') {
          throw new Error('Translation failed');
        } else {
          setTimeout(pollStatus, 2000);
          setProgress(prev => Math.min(prev + 20, 90));
        }
      };

      await pollStatus();
    } catch (error) {
      console.error('Translation error:', error);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const recordedFile = new File([blob], 'recording.webm', { type: 'video/webm' });
        
        const formData = new FormData();
        formData.append('file', recordedFile);
        
        try {
          const response = await fetch('http://localhost:8000/api/v1/upload-video', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setJobId(data.job_id);
          setFile(recordedFile);
          setOriginalVideo(URL.createObjectURL(blob));
        } catch (error) {
          console.error('Upload failed:', error);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && stream) {
      mediaRecorderRef.current.stop();
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton />

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              Video Translation Dashboard
            </h1>
            <div className="flex items-center gap-2 text-purple-400">
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm text-gray-300">{credits} credits remaining</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {isRecording ? 'Recording Preview' : 'Upload Video'}
                </h2>
                <div className="flex items-center gap-3">
                  {!isRecording && (
                    <label className="flex items-center gap-2 px-4 py-2 bg-purple-600/50 text-white rounded-lg cursor-pointer hover:bg-purple-700/50 transition-colors">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isProcessing}
                      />
                    </label>
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-purple-600/50 hover:bg-purple-700/50 text-white'
                    } transition-colors`}
                  >
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    {isRecording ? 'Stop Recording' : 'Record Live'}
                  </button>
                </div>
              </div>

              {(stream || originalVideo) && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls={!!originalVideo}
                    src={originalVideo || undefined}
                    autoPlay={!!stream}
                    muted={!!stream}
                  />
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full text-white">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm">REC</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 space-y-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Dialect Settings</h3>
                  <select
                    value={selectedDialect}
                    onChange={(e) => setSelectedDialect(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {dialects.map(dialect => (
                      <option key={dialect.id} value={dialect.id}>
                        {dialect.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={startTranslation}
                  disabled={!file || isProcessing || credits <= 0}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 rounded-lg font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      Start Translation
                    </>
                  )}
                </button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>Translation Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {(originalVideo || translatedVideo) && (
              <VideoComparison
                originalVideo={originalVideo}
                translatedVideo={translatedVideo}
                translatedAudio={translatedAudio}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}