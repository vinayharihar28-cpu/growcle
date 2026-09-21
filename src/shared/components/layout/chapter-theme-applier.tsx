"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/shared/stores/workspace";
import { useAuthStore } from "@/shared/stores/auth";
import { getChapterTheme } from "@/lib/chapter-themes";
import { useChapterTheme } from "@/components/ThemeContext";

export function ChapterThemeApplier() {
  const { selectedChapterId, activeRole, availableChapters } = useWorkspaceStore();
  const { currentMember } = useAuthStore();
  const { setChapterThemeKey } = useChapterTheme();

  useEffect(() => {
    if (typeof document === "undefined") return;

    let targetThemeColor: string | null = null;

    if (activeRole === "Admin" || activeRole === "Director") {
      // In Admin or Director workspace:
      // If a specific chapter is selected from the chapter dropdown, apply its theme!
      // If "all" is selected, use platform default branding (indigo/default).
      if (selectedChapterId && selectedChapterId !== "all") {
        const matchingChapter = availableChapters.find((c) => c.id === selectedChapterId);
        targetThemeColor = matchingChapter?.themeColor || null;
      }
    } else if (
      activeRole === "Leadership Team" ||
      activeRole === "President" ||
      activeRole === "Vice President" ||
      activeRole === "Treasurer" ||
      activeRole === "Secretary"
    ) {
      // Leadership team workspace automatically inherits their assigned chapter's theme!
      const chapterId = currentMember?.chapterId || selectedChapterId;
      const matchingChapter = availableChapters.find((c) => c.id === chapterId);
      targetThemeColor = matchingChapter?.themeColor || null;
    } else if (activeRole === "Member") {
      // Member workspace inherits member chapter theme if desired
      const matchingChapter = availableChapters.find((c) => c.id === currentMember?.chapterId);
      targetThemeColor = matchingChapter?.themeColor || null;
    }

    // Resolve theme object
    const theme = targetThemeColor ? getChapterTheme(targetThemeColor) : null;

    if (theme) {
      // Apply chapter theme CSS variables dynamically
      document.documentElement.style.setProperty("--primary", theme.hex);
      document.documentElement.style.setProperty("--ring", theme.hex);
      document.documentElement.style.setProperty("--sidebar-primary", theme.hex);
      document.documentElement.style.setProperty("--sidebar-ring", theme.hex);
      document.documentElement.style.setProperty("--sidebar-accent-foreground", theme.hex);
      document.documentElement.style.setProperty("--accent-foreground", theme.hex);
      document.documentElement.setAttribute("data-chapter-theme", theme.id);
      setChapterThemeKey(theme.id);
    } else {
      // Reset to platform default (Growcle Indigo: #4f46e5 / dark #6366f1)
      const isDark = document.documentElement.classList.contains("dark");
      const defaultHex = isDark ? "#6366f1" : "#4f46e5";
      document.documentElement.style.setProperty("--primary", defaultHex);
      document.documentElement.style.setProperty("--ring", defaultHex);
      document.documentElement.style.setProperty("--sidebar-primary", defaultHex);
      document.documentElement.style.setProperty("--sidebar-ring", defaultHex);
      document.documentElement.style.setProperty("--sidebar-accent-foreground", defaultHex);
      document.documentElement.style.setProperty("--accent-foreground", defaultHex);
      document.documentElement.removeAttribute("data-chapter-theme");
      setChapterThemeKey("indigo");
    }
  }, [selectedChapterId, activeRole, availableChapters, currentMember, setChapterThemeKey]);

  return null;
}
