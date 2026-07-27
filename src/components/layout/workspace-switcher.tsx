'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { allWorkspaces, WorkspaceType } from '@/config/navigation';
import { ChevronDown, Check, Shield, User, Building, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { activeWorkspace, workspaceConfig, setActiveWorkspace } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectWorkspace = (type: WorkspaceType) => {
    setActiveWorkspace(type);
    setIsOpen(false);

    // Route to default workspace home
    switch (type) {
      case 'admin':
        router.push('/dashboard/administration');
        break;
      case 'super-admin':
        router.push('/dashboard/super-admin');
        break;
      case 'member':
      default:
        router.push('/dashboard');
        break;
    }
  };

  const getWorkspaceIcon = (id: WorkspaceType) => {
    switch (id) {
      case 'admin':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'super-admin':
        return <Building className="w-4 h-4 text-amber-500" />;
      case 'member':
      default:
        return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card hover:bg-accent/50 text-foreground transition-all text-xs font-medium shadow-xs"
      >
        <span className="p-1 rounded bg-accent/80">{getWorkspaceIcon(activeWorkspace)}</span>
        <div className="text-left hidden sm:block">
          <span className="font-semibold text-foreground block leading-none">{workspaceConfig.label}</span>
          <span className="text-[10px] text-muted-foreground">{workspaceConfig.badge} Workspace</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-card border rounded-xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 border-b mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Select Workspace Context
            </span>
          </div>

          <div className="space-y-0.5 px-1.5">
            {allWorkspaces.map((ws) => {
              const isSelected = activeWorkspace === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleSelectWorkspace(ws.id)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors',
                    isSelected ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium' : 'hover:bg-accent text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md border bg-background">{getWorkspaceIcon(ws.id)}</div>
                    <div>
                      <div className="text-xs font-semibold">{ws.label}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{ws.description}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
