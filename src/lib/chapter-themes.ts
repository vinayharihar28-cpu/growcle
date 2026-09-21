export interface ChapterTheme {
  id: string;
  name: string;
  hex: string;
  primary: string;
  buttonBg: string;
  buttonHover: string;
  cardBorder: string;
  accentGlow: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  ringColor: string;
  lightBg: string;
}

export const CHAPTER_THEMES: Record<string, ChapterTheme> = {
  emerald: {
    id: "emerald",
    name: "Emerald Vitality",
    hex: "#10b981",
    primary: "emerald-600",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    buttonHover: "hover:bg-emerald-700",
    cardBorder: "border-emerald-500/30",
    accentGlow: "shadow-emerald-500/20",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    textColor: "text-emerald-600 dark:text-emerald-400",
    ringColor: "focus:ring-emerald-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  purple: {
    id: "purple",
    name: "Royal Purple",
    hex: "#8b5cf6",
    primary: "purple-600",
    buttonBg: "bg-purple-600 hover:bg-purple-700 text-white",
    buttonHover: "hover:bg-purple-700",
    cardBorder: "border-purple-500/30",
    accentGlow: "shadow-purple-500/20",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "text-purple-600 dark:text-purple-400",
    textColor: "text-purple-600 dark:text-purple-400",
    ringColor: "focus:ring-purple-500",
    lightBg: "bg-purple-50 dark:bg-purple-950/20",
  },
  amber: {
    id: "amber",
    name: "Solar Amber",
    hex: "#f59e0b",
    primary: "amber-600",
    buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
    buttonHover: "hover:bg-amber-700",
    cardBorder: "border-amber-500/30",
    accentGlow: "shadow-amber-500/20",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "text-amber-600 dark:text-amber-400",
    textColor: "text-amber-600 dark:text-amber-400",
    ringColor: "focus:ring-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-950/20",
  },
  rose: {
    id: "rose",
    name: "Velvet Rose",
    hex: "#f43f5e",
    primary: "rose-600",
    buttonBg: "bg-rose-600 hover:bg-rose-700 text-white",
    buttonHover: "hover:bg-rose-700",
    cardBorder: "border-rose-500/30",
    accentGlow: "shadow-rose-500/20",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "text-rose-600 dark:text-rose-400",
    textColor: "text-rose-600 dark:text-rose-400",
    ringColor: "focus:ring-rose-500",
    lightBg: "bg-rose-50 dark:bg-rose-950/20",
  },
  cyan: {
    id: "cyan",
    name: "Electric Cyan",
    hex: "#06b6d4",
    primary: "cyan-600",
    buttonBg: "bg-cyan-600 hover:bg-cyan-700 text-white",
    buttonHover: "hover:bg-cyan-700",
    cardBorder: "border-cyan-500/30",
    accentGlow: "shadow-cyan-500/20",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    textColor: "text-cyan-600 dark:text-cyan-400",
    ringColor: "focus:ring-cyan-500",
    lightBg: "bg-cyan-50 dark:bg-cyan-950/20",
  },
  indigo: {
    id: "indigo",
    name: "Midnight Indigo",
    hex: "#6366f1",
    primary: "indigo-600",
    buttonBg: "bg-indigo-600 hover:bg-indigo-700 text-white",
    buttonHover: "hover:bg-indigo-700",
    cardBorder: "border-indigo-500/30",
    accentGlow: "shadow-indigo-500/20",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    textColor: "text-indigo-600 dark:text-indigo-400",
    ringColor: "focus:ring-indigo-500",
    lightBg: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  crimson: {
    id: "crimson",
    name: "Crimson Red",
    hex: "#dc2626",
    primary: "red-600",
    buttonBg: "bg-red-600 hover:bg-red-700 text-white",
    buttonHover: "hover:bg-red-700",
    cardBorder: "border-red-500/30",
    accentGlow: "shadow-red-500/20",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    badgeText: "text-red-600 dark:text-red-400",
    textColor: "text-red-600 dark:text-red-400",
    ringColor: "focus:ring-red-500",
    lightBg: "bg-red-50 dark:bg-red-950/20",
  },
  orange: {
    id: "orange",
    name: "Sunset Orange",
    hex: "#ea580c",
    primary: "orange-600",
    buttonBg: "bg-orange-600 hover:bg-orange-700 text-white",
    buttonHover: "hover:bg-orange-700",
    cardBorder: "border-orange-500/30",
    accentGlow: "shadow-orange-500/20",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "text-orange-600 dark:text-orange-400",
    textColor: "text-orange-600 dark:text-orange-400",
    ringColor: "focus:ring-orange-500",
    lightBg: "bg-orange-50 dark:bg-orange-950/20",
  },
};

export const DEFAULT_CHAPTER_THEME = CHAPTER_THEMES.emerald;

export function getChapterTheme(themeKey?: string | null): ChapterTheme {
  if (!themeKey) return DEFAULT_CHAPTER_THEME;
  const normalized = themeKey.toLowerCase().trim();
  return CHAPTER_THEMES[normalized] || DEFAULT_CHAPTER_THEME;
}
