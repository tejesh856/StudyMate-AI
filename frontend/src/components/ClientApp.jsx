'use client';

import { CheckAuth } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Brain } from "lucide-react";
import { socket } from "@/lib/socket";

export default function ClientApp({ children }) {
  const { theme, initTheme } = useThemeStore();
  const { authUser, setAuthUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isPending, data, isError } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: CheckAuth,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  refetchOnWindowFocus: true,
  retry: false,
  });
  

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    if (data?.user) {
      setAuthUser(data.user);
    } else if (isError) {
      setAuthUser(null);
    }
  }, [data, isError, setAuthUser]);
useEffect(() => {
  if (authUser?._id && socket.connected) {
    socket.emit('join_user_room', authUser._id);
  } else {
    socket.on('connect', () => {
      if (authUser?._id) {
        socket.emit('join_user_room', authUser._id);
      }
    });
  }
}, [authUser]);



  if (isPending && !authUser) {
    return (
      <div data-theme={theme} className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <Brain className="text-primary" size={48} strokeWidth={2} />
          <span className="loading loading-dots loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return <div data-theme={theme} className="min-h-screen flex bg-base-200">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> 
  
        {/* Main Content */}
        <main className="flex-1">
          <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
          {children}
        </main>
      </div>;
}