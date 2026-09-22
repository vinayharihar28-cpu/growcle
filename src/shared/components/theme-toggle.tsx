"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface ThemeToggleProps {
  variant?: "switch" | "dropdown" | "button";
  showLabel?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function ThemeToggle({
  variant = "switch",
  showLabel = false,
  size = "default",
  className,
}: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // Segmented Switch Mode (Light / Dark / System)
  if (variant === "switch") {
    if (!mounted) {
      return (
        <div
          className={cn(
            "inline-flex items-center gap-0.5 p-1 rounded-full bg-muted/60 border border-border/60 shadow-inner h-9 opacity-60",
            className
          )}
        >
          <div className="w-8 h-7 rounded-full bg-muted animate-pulse" />
          <div className="w-8 h-7 rounded-full bg-muted animate-pulse" />
          <div className="w-8 h-7 rounded-full bg-muted animate-pulse" />
        </div>
      );
    }

    const currentTheme = theme || "system";

    const options = [
      {
        id: "light",
        label: "Light",
        icon: Sun,
        activeColor: "text-amber-500 fill-amber-500/20",
        tooltip: "Switch to Light theme",
      },
      {
        id: "dark",
        label: "Dark",
        icon: Moon,
        activeColor: "text-indigo-500 dark:text-indigo-400 fill-indigo-500/20",
        tooltip: "Switch to Dark theme",
      },
      {
        id: "system",
        label: "System",
        icon: Monitor,
        activeColor: "text-sky-500 dark:text-sky-400",
        tooltip: "Follow System preferences",
      },
    ] as const;

    return (
      <div
        role="radiogroup"
        aria-label="Color theme selection"
        className={cn(
          "inline-flex items-center gap-0.5 p-1 rounded-full bg-muted/70 dark:bg-slate-900/80 border border-border/80 dark:border-slate-800 shadow-inner backdrop-blur-xs transition-all",
          size === "sm" ? "h-8" : "h-9",
          className
        )}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentTheme === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              title={opt.tooltip}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "relative flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                size === "sm" ? "px-2 py-1 text-[11px]" : "px-2.5 py-1 text-xs",
                isActive
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10 font-semibold scale-100"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-normal"
              )}
            >
              <Icon
                className={cn(
                  "transition-transform duration-200",
                  size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
                  isActive ? cn(opt.activeColor, "scale-110") : "opacity-70"
                )}
              />
              {showLabel && (
                <span className="leading-none text-[11px] font-medium">
                  {opt.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        className={cn("h-9", !showLabel && "w-9", className)}
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 opacity-50" />
        {showLabel && <span className="ml-2 text-xs">Theme</span>}
      </Button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "h-9 relative transition-colors cursor-pointer",
          !showLabel && "w-9",
          className
        )}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-all hover:-rotate-12" />
        )}
        {showLabel && (
          <span className="ml-2 text-xs font-medium">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: showLabel ? "default" : "icon" }),
          "h-9 cursor-pointer",
          !showLabel && "w-9",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
        {showLabel && (
          <span className="ml-2 text-xs font-medium capitalize">
            {resolvedTheme ?? "Theme"}
          </span>
        )}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={cn("cursor-pointer flex items-center justify-between", theme === "light" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" /> Light
          </span>
          {theme === "light" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={cn("cursor-pointer flex items-center justify-between", theme === "dark" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400" /> Dark
          </span>
          {theme === "dark" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={cn("cursor-pointer flex items-center justify-between", theme === "system" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-sky-400" /> System
          </span>
          {theme === "system" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
