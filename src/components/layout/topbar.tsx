"use client";

import { Moon, Sun, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-xl font-bold whitespace-nowrap hidden lg:block">Growcle</h2>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 z-50 overflow-hidden">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link 
                href="/help" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
              <div className="border-t my-1"></div>
              <button 
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
