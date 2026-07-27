'use client';

import { Moon, Sun, User, Settings, HelpCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { WorkspaceSwitcher } from './workspace-switcher';
import { usePermissions } from '@/lib/permissions/use-permissions';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentRole } = usePermissions();

  useEffect(() => {
    setMounted(true);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-xs flex items-center justify-between px-6 sticky top-0 z-10 w-full transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-3 ml-4">
        {/* Active Role Indicator Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/60 border text-[11px] font-medium text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Role: <strong className="text-foreground">{currentRole.name}</strong></span>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-lg border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold text-foreground hidden md:inline">Alexandra Chen</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-card border rounded-xl shadow-xl py-1.5 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2 border-b">
                <p className="text-xs font-bold text-foreground">Alexandra Chen</p>
                <p className="text-[11px] text-muted-foreground truncate">alexandra.chen@apextechnologies.io</p>
              </div>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profile & Bio
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Account Settings
              </Link>
              <Link
                href="/dashboard/rbac"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                RBAC & Permissions
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                Help & Documentation
              </Link>
              <div className="border-t my-1"></div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium"
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
