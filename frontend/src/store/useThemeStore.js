import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "dark", // default theme
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("study-theme", theme);
    }
    set({ theme });
  },
  initTheme: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("study-theme") || "dark";
      set({ theme: saved });
    }
  },
}));