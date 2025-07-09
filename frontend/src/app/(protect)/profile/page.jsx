'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { getInitials, toTitleCase } from '@/lib/utils';
import {
  Pencil,
  GraduationCap,
  Star,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/dashboard';
import Image from 'next/image';

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const { data: statsData, isPending: statsLoading } = useQuery({
  queryKey: ['stats'],
  queryFn: getStats,
});
  const showImage = authUser?.profilePic && authUser.profilePic.trim() !== '';
  const initials = getInitials(authUser?.name || 'Student');
  const stats = statsData?.stats
  ? [
      { title: 'Courses Completed', value: statsData.stats.coursesCompleted,color: 'text-primary' },
      { title: 'Quizzes Taken', value: statsData.stats.totalQuizzesTaken,color: 'text-secondary' },
      { title: 'Learning Streak', value: `${statsData.stats.learningStreak} day${statsData.stats.learningStreak > 1 ? 's' : ''}`,color: 'text-accent' },
      { title: 'AI Suggestions', value: statsData.stats.aiSuggestionCount,color: 'text-info' },
    ]
  : [];

  return (
    <div style={{ padding: '2rem 1.5rem' }} className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div style={{ margin: '0 auto' }} className="max-w-6xl">

        {/* Header */}
        <div style={{ marginBottom: '2rem' }} className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">👤 Profile</h1>
          <Link href="/settings" className="btn btn-outline btn-sm gap-2 border-primary text-primary">
            <Pencil size={16} />
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div style={{padding:'1rem'}} className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden relative">
          {/* Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/5 to-transparent pointer-events-none" />

          <div className="card-body">
            <div className="flex items-center gap-8">

              {/* Profile Image with glow */}
              <div className="avatar">
                <div style={{
      backgroundColor: showImage ? 'transparent' : authUser?.color || '#888888',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white',
      fontWeight: 'bold',
    }} className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg shadow-primary/30">
                 {showImage ? (
                    <Image
                      src={authUser.profilePic}
                      alt="User Avatar"
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl font-bold leading-tight">
                  {authUser?.name ? toTitleCase(authUser.name) : 'Student Name'}
                </h2>
                <p style={{marginTop:'0.25rem'}} className="text-base-content/70 flex items-center gap-1">
                  <User className="inline-block w-4 h-4" />
                  {authUser?.email || 'student@email.com'}
                </p>
                <div
                  className="badge badge-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold border-0"
                  style={{ fontSize: '0.75rem', marginTop:'0.75rem' }}
                >
                  🌟 Premium Member
                </div>
              </div>
            </div>

            {/* Stats Section */}
           {/* Stats Section */}
<div style={{ marginTop: '2rem' }}>
  {statsLoading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array(4)
        .fill(0)
        .map((_, idx) => (
          <div
          style={{padding:'1.5rem'}}
            key={idx}
            className="bg-base-200 border border-base-300 rounded-xl shadow-sm"
          >
            <div style={{marginBottom:'1rem'}} className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-6 bg-base-300 rounded w-3/4"></div>
          </div>
        ))}
    </div>
  ) : stats.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{ padding: '1rem' }}
          className={`stat bg-base-200 rounded-xl text-center border border-base-300 hover:shadow-md transition-all duration-200`}
        >
          <div className="stat-title">{stat.title}</div>
          <div className={`stat-value ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  ) : (
    <div
      style={{ padding: '1.5rem' }}
      className="col-span-full flex flex-col items-center justify-center text-center gap-4 bg-base-100 border border-base-300 rounded-xl shadow-sm animate-fade-in"
    >
      <img src="/empty-stats.svg" alt="No Stats" className="w-32 h-32 opacity-60" />
      <h3 className="text-lg font-semibold text-base-content">No Stats Yet</h3>
      <p className="text-sm text-base-content/70 max-w-md">
        Your learning stats will appear here after you complete a course or take a quiz. Start learning to see progress!
      </p>
    </div>
  )}
</div>


            {/* Actions */}
            <div style={{ marginTop: '2rem' }} className="flex gap-4">
              <Link href="/learn" className="btn btn-primary flex-1/2 gap-2">
                <GraduationCap size={18} />
                Go to Learning
              </Link>
              <Link href="/quiz" className="btn btn-secondary flex-1/2 gap-2">
                <Star size={18} />
                Take a Quiz
              </Link>
            </div>

            {/* Logout */}
            <div style={{ marginTop: '1rem' }} className="text-center">
              <button className="text-error flex items-center justify-center gap-2 hover:underline">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestion Note */}
        <div
          style={{ marginTop: '2rem' }}
          className="text-sm text-base-content/60 text-center flex justify-center items-center gap-2"
        >
          <Sparkles className="text-warning" size={16} />
          <span>More personalized suggestions coming soon!</span>
        </div>
      </div>
    </div>
  );
}
