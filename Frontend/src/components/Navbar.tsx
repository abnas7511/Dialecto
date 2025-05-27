import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, Languages, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { isAuthenticated, credits, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Globe2 className="h-9 w-9 text-purple-400" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Dialecto
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-purple-400 flex items-center">
                  <Languages className="h-5 w-5 mr-2" />
                  <span>{credits} credits left</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white transition-colors bg-purple-600 px-4 py-2 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors mr-1"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}