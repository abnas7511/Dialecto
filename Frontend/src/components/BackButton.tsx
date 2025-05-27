import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
    >
      <ChevronLeft className="h-5 w-5 mr-1" />
      Back
    </button>
  );
}