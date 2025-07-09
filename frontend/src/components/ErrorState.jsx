'use client';

import React from 'react';

export default function ErrorState({ 
  icon, 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again later.", 
  onRetry, 
  retryLabel = "Retry"
}) {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center gap-6 animate-fade-in text-center">
      {/* Icon Section */}
      <div style={{padding:'1rem'}} className="bg-error/10 border border-error/30 rounded-full shadow">
        <div className="w-10 h-10 text-error animate-pulse">
          {icon}
        </div>
      </div>

      {/* Text Content */}
      <div>
        <h2 className="text-xl font-bold text-error">{title}</h2>
        <p style={{marginTop:'0.25rem'}} className="text-base text-base-content/70">
          {message}
        </p>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-error gap-2">
          🔄 {retryLabel}
        </button>
      )}
    </div>
  );
}
