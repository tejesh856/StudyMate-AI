'use client';
import Link from 'next/link';
import {
  ListChecks,
  History,
  Sparkles,
  PlayCircle,
} from 'lucide-react';



const stats = [
  { label: 'Courses Completed', value: 4 },
  { label: 'Quizzes Taken', value: 15 },
  { label: 'Learning Streak', value: '5 days' },
  { label: 'AI Suggestions', value: 3 },
];

export default function DashboardPage() {
 

  return (
   
        <div style={{ padding: '2rem' }}>
          {/* Dashboard Header */}
        <div style={{ marginBottom: '2rem' }} className=" flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 style={{ marginBottom: '0.5rem' }} className="text-3xl font-bold text-primary">Welcome back 👋</h1>
            <p className="text-base-content/70">
              Your personalized AI-powered learning dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/learn" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className="btn btn-primary btn-sm flex items-center gap-2">
              <PlayCircle size={18} /> Start Learning
            </Link>
            <Link href="/dashboard/quiz" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className="btn btn-secondary btn-sm flex items-center gap-2">
              <ListChecks size={18} /> Take a Quiz
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: '2.5rem' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-base-content/70">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }} className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="text-secondary" /> AI Suggestions for You
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-base-content">
            <li>Review your last quiz on <span className="font-semibold text-primary">Photosynthesis</span></li>
            <li>Try a new course: <span className="font-semibold text-primary">Introduction to Calculus</span></li>
            <li>Practice with 5 new AI-generated questions</li>
            <li>Watch a summary video for <span className="font-semibold text-primary">World War II</span></li>
          </ul>
        </div>

        {/* Resume Learning */}
<div>
  <div style={{ marginBottom: '1rem' }} className="flex items-center justify-between">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <History size={20} /> Resume Learning
    </h2>
    <Link href="/dashboard/history" className="text-primary hover:underline text-sm font-medium">
      View All
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Example Card 1 */}
    <div className="card bg-base-100 shadow-md overflow-hidden">
      <figure className="h-40 overflow-hidden">
        <img src="/algebra.jpg" alt="Algebra Basics" className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="text-lg font-semibold">Algebra Basics</h3>
        <p style={{ marginBottom: '0.5rem' }} className="text-sm text-base-content/70">Quiz • June 10, 2025</p>
        <progress style={{ marginBottom: '0.5rem' }} className="progress progress-success w-full" value={100} max="100"></progress>
        <div className="flex justify-between items-center">
          <span className="badge badge-success">Completed</span>
          <button className="btn btn-sm btn-primary">Continue</button>
        </div>
      </div>
    </div>

    {/* Example Card 2 */}
    <div className="card bg-base-100 shadow-md overflow-hidden">
      <figure className="h-40 overflow-hidden">
        <img src="/algebra.jpg" alt="Photosynthesis" className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="text-lg font-semibold">Photosynthesis</h3>
        <p style={{ marginBottom: '0.5rem' }} className="text-sm text-base-content/70">Video Lesson • June 9, 2025</p>
        <progress style={{ marginBottom: '0.5rem' }} className="progress progress-info w-full" value={100} max="100"></progress>
        <div className="flex justify-between items-center">
          <span className="badge badge-info">Watched</span>
          <button className="btn btn-sm btn-primary">Continue</button>
        </div>
      </div>
    </div>

    {/* Example Card 3 */}
    <div className="card bg-base-100 shadow-md overflow-hidden">
      <figure className="h-40 overflow-hidden">
        <img src="/algebra.jpg" alt="World War II" className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="text-lg font-semibold">World War II</h3>
        <p style={{ marginBottom: '0.5rem' }} className="text-sm text-base-content/70">Practice • June 8, 2025</p>
        <progress style={{ marginBottom: '0.5rem' }} className="progress progress-warning w-full" value={60} max="100"></progress>
        <div style={{ padding: '0.5rem' }} className="flex justify-between items-center">
          <span className="badge badge-warning">In Progress</span>
          <button className="btn btn-sm btn-primary">Continue</button>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
     
  );
}