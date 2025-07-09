'use client';
import Link from 'next/link';
import {
  ListChecks,
  History,
  PlayCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toTitleCase } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getProgressResume, getStats } from '@/services/dashboard';
import StatsSection from '@/components/dashboard/StatsSection';
import SuggestionsSection from '@/components/dashboard/SuggestionSection';
import ResumeSection from '@/components/dashboard/ResumeCourses';


export default function DashboardPage() {
  const {authUser}=useAuthStore();
  const { data: resumeData, isPending: resumeLoading, error: resumeError } = useQuery({
  queryKey: ['resume-progress'],
  queryFn: getProgressResume,
  refetchOnWindowFocus:false
  
});

const { data: statsData, isPending: statsLoading, error: statsError } = useQuery({
  queryKey: ['stats'],
  queryFn: getStats,
  refetchOnWindowFocus:false
});

const stats =statsData?.stats
  ? [
      { label: 'Courses Completed', value: statsData.stats.coursesCompleted },
      { label: 'Quizzes Taken', value: statsData.stats.totalQuizzesTaken },
      { label: 'Learning Streak', value: `${statsData.stats.learningStreak} day${statsData.stats.learningStreak > 1 ? 's' : ''}` },
      { label: 'AI Suggestions', value: statsData.stats.aiSuggestionCount },
    ]
  : [];

  return (
   
        <div style={{ padding: '2rem' }}>
          {/* Dashboard Header */}
        <div style={{ marginBottom: '2rem' }} className=" flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
<h1 className="text-4xl font-bold text-primary">Welcome back, <span className="text-secondary">{authUser?.name ? toTitleCase(authUser.name) : "User"}</span> 👋</h1>
            <p className="text-base-content/70">
              Your personalized AI-powered learning dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/learn" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className="btn btn-primary btn-sm flex items-center gap-2">
              <PlayCircle size={18} /> Start Learning
            </Link>
            <Link href="/quiz" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className="btn btn-secondary btn-sm flex items-center gap-2">
              <ListChecks size={18} /> Take a Quiz
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: '2.5rem' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsSection
        stats={stats}
        isLoading={statsLoading}
        error={statsError}
      />


          

        </div>

        {/* AI Suggestions */}
        <SuggestionsSection
  suggestions={statsData?.suggestions}
  isLoading={statsLoading}
/>

        {/* Resume Learning */}
<div>
  <div style={{ marginBottom: '1rem' }} className="flex items-center justify-between">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <History size={20} /> Resume Learning
    </h2>
    <Link href="/learn" className="text-primary hover:underline text-sm font-medium">
      View All
    </Link>
  </div>

  
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ResumeSection
    resumeData={resumeData?.data}
    isLoading={resumeLoading}
    error={resumeError}
  />
</div>


  
</div>

        </div>
     
  );
}