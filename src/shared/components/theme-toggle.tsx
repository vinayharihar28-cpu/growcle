"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
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
  variant?: "dropdown" | "button";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = "dropdown",
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

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
          className={cn("cursor-pointer flex items-center justify-between", resolvedTheme === "light" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" /> Light
          </span>
          {resolvedTheme === "light" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={cn("cursor-pointer flex items-center justify-between", resolvedTheme === "dark" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400" /> Dark
          </span>
          {resolvedTheme === "dark" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={cn("cursor-pointer flex items-center justify-between", theme === "system" && "font-bold text-primary")}
        >
          <span className="flex items-center gap-2">
            💻 System
          </span>
          {theme === "system" && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
