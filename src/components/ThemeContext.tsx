"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ChapterTheme, DEFAULT_CHAPTER_THEME, getChapterTheme } from "@/lib/chapter-themes";

interface ThemeContextType {
  activeChapterTheme: ChapterTheme;
  setChapterThemeKey: (key: string) => void;
  activeChapterId: string | null;
  setActiveChapterId: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeChapterTheme: DEFAULT_CHAPTER_THEME,
  setChapterThemeKey: () => {},
  activeChapterId: null,
  setActiveChapterId: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function ChapterThemeProvider({
  children,
  initialThemeKey = "emerald",
  initialChapterId = null,
}: {
  children: React.ReactNode;
  initialThemeKey?: string;
  initialChapterId?: string | null;
}) {
  const [themeKey, setThemeKey] = useState<string>(initialThemeKey);
  const [activeChapterId, setActiveChapterIdState] = useState<string | null>(initialChapterId);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Load persisted theme preferences
    const storedTheme = localStorage.getItem("ssk_chapter_theme");
    if (storedTheme) {
      setThemeKey(storedTheme);
    }
    const storedChapter = localStorage.getItem("ssk_active_chapter_id");
    if (storedChapter) {
      setActiveChapterIdState(storedChapter);
    }
    const storedMode = localStorage.getItem("ssk_theme_mode");
    if (storedMode === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, []);

  const setChapterThemeKey = (key: string) => {
    setThemeKey(key);
    localStorage.setItem("ssk_chapter_theme", key);
  };

  const setActiveChapterId = (id: string) => {
    setActiveChapterIdState(id);
    localStorage.setItem("ssk_active_chapter_id", id);
    // Set 1-year persistent cookie for server actions
    document.cookie = `active-chapter-id=${id}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("ssk_theme_mode", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("ssk_theme_mode", "light");
      }
      return next;
    });
  };

  const activeChapterTheme = getChapterTheme(themeKey);

  return (
    <ThemeContext.Provider
      value={{
        activeChapterTheme,
        setChapterThemeKey,
        activeChapterId,
        setActiveChapterId,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useChapterTheme() {
  return useContext(ThemeContext);
}
