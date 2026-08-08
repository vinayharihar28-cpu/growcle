'use client';

import { useState, useRef, useEffect } from 'react';
import { useOrganizationStore, MOCK_ORGANIZATIONS } from '@/stores/use-organization-store';
import { ChevronDown, Check, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrgSelector() {
  const { activeOrganization, setActiveOrganization } = useOrganizationStore();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card hover:bg-accent/50 text-foreground transition-all text-xs font-semibold shadow-xs"
      >
        <span className="p-1 rounded bg-accent/80">
          <Building className="w-3.5 h-3.5 text-indigo-500" style={{ color: activeOrganization.primaryColor }} />
        </span>
        <span className="max-w-[120px] sm:max-w-[180px] truncate block text-left leading-none font-bold">
          {activeOrganization.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-card border rounded-xl shadow-xl py-1.5 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1 border-b mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Select Organization Context
            </span>
          </div>

          <div className="space-y-0.5 px-1.5">
            {MOCK_ORGANIZATIONS.map((org) => {
              const isSelected = activeOrganization.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    setActiveOrganization(org.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors',
                    isSelected ? 'bg-indigo-50 dark:bg-indigo-950/40 font-semibold text-indigo-600 dark:text-indigo-400' : 'hover:bg-accent text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: org.primaryColor }} />
                    <span className="text-xs truncate block">{org.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
