'use client';

import { CheckAuth } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import useQuizStore from "@/store/useQuizStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Brain } from "lucide-react";

export default function ClientApp({ children }) {
  const { theme, initTheme } = useThemeStore();
  const { authUser, setAuthUser } = useAuthStore();
  const { quizData } = useQuizStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);



  const { isPending, data, isError, refetch } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: CheckAuth,
    staleTime: 1000 * 60 * 5,
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
    refetch();
  }, [authUser, refetch]);

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