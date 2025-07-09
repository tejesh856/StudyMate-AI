'use client';
import { Logout } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import useQuizStore from '@/store/useQuizStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Brain, History, Home, ListChecks, LogOut, Settings, User, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation'; // ✅ import this

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname(); // ✅ get current path
  const queryClient = useQueryClient();
  const { setAuthUser, authUser } = useAuthStore();
  const { quizData } = useQuizStore();

  const { mutate: logoutTrigger } = useMutation({
    mutationFn: Logout,
    onSuccess: (data) => {
      toast.success('Logout successful! 🎉');
      console.log('Success:', data);
      setAuthUser(null);
      queryClient.cancelQueries();
      queryClient.removeQueries();
      queryClient.clear();
      window.location.reload();
    },
  });

  const sidebarLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { name: 'Learn', icon: <BookOpen size={20} />, href: '/learn' },
    { name: 'Quiz', icon: <ListChecks size={20} />, href: '/quiz' },
    { name: 'Profile', icon: <User size={20} />, href: '/profile' },
    { name: 'Settings', icon: <Settings size={20} />, href: '/settings' }
  ];

  if (!authUser || quizData) return null;

  return (
     <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
    <aside className="fixed top-0 left-0 w-72 h-screen bg-base-100 shadow-lg flex flex-col justify-between z-50">
      <div>
        <div style={{padding:'1.5rem'}} className="relative">
  {/* Close button top-right */}
  <button
    onClick={onClose}
    className="btn btn-sm btn-circle absolute top-4 right-4 text-base-content hover:bg-error btn-ghost"
  >
    <X size={20} />
  </button>

  {/* Logo */}
  <div className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
    <Brain className="text-primary" size={28} />
    Studymate AI
  </div>
</div>

        <ul style={{ padding: '0.5rem', width: '100%' }} className="menu">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li style={{ marginTop: '1rem', width: '100%' }} key={link.name}>
                <Link
                  style={{ width: '100%', padding: '0.5rem' }}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg ${
                    isActive ? 'bg-primary text-primary-content font-semibold' : ''
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ padding: '1rem' }}>
        <button onClick={() => logoutTrigger()} className="btn btn-error btn-outline w-full flex items-center gap-2">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
    </div>

  );
}
