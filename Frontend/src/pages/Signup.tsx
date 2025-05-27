import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import BackButton from '../components/BackButton';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    navigate('/services');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 border border-purple-500/20">
          <div className="text-center mb-8">
            <UserPlus className="h-8 w-8 sm:h-12 sm:w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Create your account</h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2">Start your translation journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white/10 border border-purple-500/20 text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white/10 border border-purple-500/20 text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 sm:py-2 sm:px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}