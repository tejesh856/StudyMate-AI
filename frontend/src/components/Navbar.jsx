'use client';
import { Bell, Brain,  Loader2, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import useQuizStore from '@/store/useQuizStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markReadNotifications } from '@/services/notification';
import {  useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const router=useRouter();
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();
  const { quizData } = useQuizStore();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {data:notificationsRes,isPending}=useQuery({
    queryKey:['notifications'],
    queryFn:getNotifications,
    enabled: !!authUser,
  });

  const notifications = notificationsRes?.data || [];
  const unreadCount = notifications?.filter((n) => !n.read).length;
  
  const {mutate:markNotificationTrigger, isPending:isMarking}=useMutation({
    mutationFn:({id,notification})=>markReadNotifications(id),
    onSuccess:(data,variables)=>{
      const { notification } = variables;
      console.log('variables',variables);
      if (data.success) {
    const courseId = notification.metadata?.courseId;
      if (courseId) {
        router.push(`/learn/${courseId}`);
      }

      setDropdownOpen(false); 

      }
    },
    onError:()=>{
      toast.error('❌ Failed to mark notification as read.');

    }
  })

  const handleMarkRead = (notification) => {
    markNotificationTrigger({ id: notification._id, notification });
  };


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = pathname === '/';
  const isLoginOrSignup = pathname === '/login' || pathname === '/signup';
  const isLoggedIn = !!authUser;

  return (
    <header className="navbar sticky top-0 z-40 bg-base-100/70 backdrop-blur-lg shadow-md border-b border-base-300 px-6 py-3">
      
      {/* Logo */}
      <div className="navbar-start">
        {(isHome || isLoginOrSignup) && (
          <Link href="/" className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Brain size={40} strokeWidth={1.5} /> StudyMate AI
          </Link>
        )}
        {authUser && !quizData && (
          <button onClick={onToggleSidebar} className="btn btn-ghost btn-circle">
            <Menu size={22} />
          </button>
        )}
        {quizData && (
          <div className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Brain size={40} strokeWidth={1.5} /> StudyMate AI
          </div>
        )}

      </div>

      {/* Navigation links only on Home page and not logged in */}
      {isHome && !authUser && (
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-4 text-base font-medium text-base-content">
            <li><button onClick={() => scrollToSection('features')} className="hover:text-primary transition">Features</button></li>
            <li><button onClick={() => scrollToSection('how')} className="hover:text-primary transition">How It Works</button></li>
            <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition">Testimonials</button></li>
            <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary transition">FAQ</button></li>
          </ul>
        </div>
      )}

      {/* Right Section */}
      <div className="navbar-end flex items-center gap-2 ml-auto">
        {/* Notification Bell */}
        {isLoggedIn && (
          <div  className={`dropdown dropdown-end ${dropdownOpen ? 'dropdown-open' : ''}`} tabIndex={0}>
            <button
              //tabIndex={0}
              className="btn btn-ghost btn-circle relative"
              onClick={() => 
              {
                console.log('clicked bell');
                setDropdownOpen((prev) => !prev)
              }
              }
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <div className="badge badge-error badge-sm absolute -top-1 -right-1">
                  {unreadCount}
                </div>
              )}
            </button>

            {dropdownOpen && (
  <div
  tabIndex={0}
    className="dropdown-content z-50 shadow-xl bg-base-100 rounded-xl w-96 max-h-[26rem] overflow-y-auto border border-base-300"
    style={{ marginTop: '1.5rem', padding: '0.75rem' }}
  >
    <div style={{padding:'0rem 0.5rem',paddingBottom:'0.5rem'}} className="text-lg font-bold text-base-content border-b border-base-300">
      🔔 Notifications
    </div>

    {isPending ? (
      <div style={{padding:'1rem'}} className="flex justify-center items-center text-primary">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    ) : notifications.length === 0 ? (
      <div style={{padding:'1rem'}} className="text-sm text-base-content/60 text-center">
        No notifications yet.
      </div>
    ) : (
      <div style={{marginTop:'0.5rem'}} className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            style={{padding:'0.75rem'}}
            key={notification._id}
            className={`cursor-pointer transition-all border border-base-300 rounded-xl shadow-sm hover:shadow-md hover:bg-base-200 group ${
              !notification.read ? 'bg-primary/5 border-primary/50' : 'bg-base-100'
            }`}
            onClickCapture={() => {
    console.log('clicked notification', notification);
    handleMarkRead(notification);
  }}
          >
            <div style={{marginBottom:'0.25rem'}} className="flex justify-between items-center">
              <p className="text-sm font-semibold text-base-content">
                {notification.title}
              </p>
              {!notification.read && (
                <span style={{padding:'0.25rem'}} className="badge badge-xs bg-primary text-base-content animate-pulse">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-base-content/80 line-clamp-2">
              {notification.message}
            </p>
            <p style={{marginTop:'0.25rem'}} className="text-[10px] text-base-content/50 italic">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          </div>
        )}
        
        {/* Theme Toggle - always visible */}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            checked={theme === 'dark'}
          />
          <svg className="swap-off fill-current w-8 h-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5 12a7 7 0 1114 0 7 7 0 01-14 0zm7-9a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1zm7.071 2.929a1 1 0 011.414 1.414L19.414 7.414a1 1 0 01-1.414-1.414l1.071-1.071zM21 11a1 1 0 110 2h-2a1 1 0 110-2h2zm-2.929 7.071a1 1 0 01-1.414 1.414L16.586 19.414a1 1 0 011.414-1.414l1.071 1.071zM13 20a1 1 0 11-2 0v-2a1 1 0 112 0v2zM4.929 19.071a1 1 0 01-1.414-1.414l1.071-1.071a1 1 0 011.414 1.414l-1.071 1.071zM3 13a1 1 0 110-2h2a1 1 0 110 2H3zm2.929-7.071a1 1 0 00-1.414-1.414L3.443 5.929a1 1 0 101.414 1.414l1.071-1.071z" />
          </svg>
          <svg className="swap-on fill-current w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.718 9.718 0 0112 21.75a9.75 9.75 0 01-9.75-9.75c0-4.195 2.644-7.776 6.41-9.156a0.75 0.75 0 01.89.957 7.5 7.5 0 008.8 8.8 0.75 0.75 0 01.95.9z" />
          </svg>
        </label>

        {/* Get Started Button - only on Home and not logged in */}
        {isHome && !authUser && (
          <Link
            href="/signup"
            className="hidden md:inline-flex items-center justify-center btn btn-sm md:btn-md bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:from-secondary hover:to-primary shadow-lg transition"
            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
}
