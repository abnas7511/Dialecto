import { useState, useEffect } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import BackButton from '../components/BackButton';

export default function TextDashboard() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { credits, decrementCredits } = useAuthStore();
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const maxRetries = 3;

  const checkServer = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/health', { 
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
    if (!sourceText || credits <= 0) return;
    if (serverStatus === 'offline') {
      setError('Server is not accessible. Please ensure the backend server is running.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await fetch('http://localhost:5001/api/translate-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: sourceText }),
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation failed');
        }

        const data = await response.json();
        setTranslatedText(data.translatedText);
        decrementCredits();
        return; // Success, exit retry loop
      } catch (err) {
        retries++;
        if (retries === maxRetries) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Connection failed. Please check if the server is running on http://localhost:5001';
          setError(errorMessage);
          console.error('Translation error:', err);
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
            <h2 className="text-xl sm:text-2xl font-bold text-white">Text Translation Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">{credits} credits remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serverStatus === 'offline' && (
              <div className="col-span-2 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
                Text translation server is not accessible. Please ensure it's running on http://localhost:5001
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Malayalam Text
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full h-48 rounded-lg bg-white/10 border border-purple-500/20 p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Malayalam text here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                English Translation
              </label>
              <textarea
                value={translatedText}
                readOnly
                className="w-full h-48 rounded-lg bg-white/10 border border-purple-500/20 p-4 text-white placeholder-gray-400"
                placeholder="Translation will appear here..."
              />
            </div>

            {error && (
              <div className="col-span-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={!sourceText || isProcessing || credits <= 0}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Translating...
                </>
              ) : (
                'Translate Text'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}