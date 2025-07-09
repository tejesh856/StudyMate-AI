'use client';

import { BookOpenCheck } from 'lucide-react';

export default function PendingState({
  title = 'Loading...',
  subtitle = 'Please wait while we load your content.',
  icon = <BookOpenCheck className="w-full h-full text-primary animate-bounce" />,
  showProgress = true,
}) {
  return (
    <div style={{ marginTop: '5rem' }} className="flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        {/* Icon + Ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            {icon}
          </div>
          <span className="loading loading-ring loading-lg text-secondary absolute -top-3 -right-3"></span>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary">{title}</h3>
          <p className="text-sm text-base-content/70">{subtitle}</p>
        </div>

        {/* Optional Progress Bar */}
        {showProgress && (
          <progress className="progress progress-primary w-64"></progress>
        )}
      </div>
    </div>
  );
}
