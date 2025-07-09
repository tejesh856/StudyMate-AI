// components/dashboard/StatsSection.tsx
'use client';
import Link from 'next/link';

export default function StatsSection({ stats, isLoading, error }) {
  if (error) {
    return (
      <div style={{ padding: '1rem' }} className="w-full bg-error/10 border border-error rounded-xl flex items-start gap-4 shadow-lg animate-fade-in">
        <div style={{ padding: '0.25rem' }} className="bg-error rounded-full text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-error font-bold text-lg">Stats Load Failed</h3>
          <p className="text-sm text-base-content/70">We couldn’t load your dashboard stats. Please check your connection or try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return Array(4).fill(0).map((_, idx) => (
      <div key={idx} className="card bg-base-100 shadow-md animate-pulse">
        <div className="card-body items-center text-center flex flex-col gap-2">
          <div className="w-16 h-6 bg-base-300 rounded-full"></div>
          <div className="w-24 h-4 bg-base-300 rounded-full"></div>
        </div>
      </div>
    ));
  }

  if (stats.length === 0) {
    return (
      <div style={{ padding: '1.5rem' }} className="col-span-full flex flex-col items-center justify-center text-center gap-4 bg-base-100 border border-base-300 rounded-xl shadow-sm animate-fade-in">
        <img src="/empty-stats.svg" alt="No Stats" className="w-32 h-32 opacity-60" />
        <h3 className="text-lg font-semibold text-base-content">No Stats Yet</h3>
        <p className="text-sm text-base-content/70 max-w-md">
          Your learning stats will appear here after you complete a course or take a quiz. Start learning to see progress!
        </p>
        <Link href="/learn" className="btn btn-primary btn-sm">🚀 Start Learning</Link>
      </div>
    );
  }

  return stats?.map((stat) => (
    <div key={stat.label} className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <div className="text-3xl font-bold text-primary">{stat.value}</div>
        <div className="text-base-content/70">{stat.label}</div>
      </div>
    </div>
  ));
}
