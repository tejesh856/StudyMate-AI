'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckAuth } from "@/services/auth";
import { Brain, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import useQuizStore from "@/store/useQuizStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <InnerApp>{children}</InnerApp>
        </QueryClientProvider>
      </body>
    </html>
  );
}

// Split the inner logic that uses react-query into a separate component
function InnerApp({ children }) {
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
