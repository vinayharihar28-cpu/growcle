'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { useOrganizationStore } from '@/stores/use-organization-store';
import { usePermissions } from '@/lib/permissions/use-permissions';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Building2,
  Share2,
  UserPlus,
  UserCheck,
  Users2,
  Building,
  Palette,
  Lock,
  CreditCard,
  FileText,
  Settings,
  LucideIcon,
  User,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  KeyRound,
  Building2,
  Share2,
  UserPlus,
  UserCheck,
  Users2,
  Building,
  Palette,
  Lock,
  CreditCard,
  FileText,
  User,
};

export function Sidebar() {
  const pathname = usePathname();
  const { workspaceConfig } = useWorkspaceStore();
  const { activeOrganization } = useOrganizationStore();
  const { can } = usePermissions();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex border-r border-slate-800 shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div
          className="p-2 rounded-xl shadow-md text-white transition-colors"
          style={{ backgroundColor: activeOrganization.primaryColor }}
        >
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white">{activeOrganization.name.split(' ')[0]}</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enterprise SaaS</p>
        </div>
      </div>

      {/* Dynamic Workspace Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {workspaceConfig.navigation.map((group, groupIdx) => {
          // Filter items by required permissions
          const visibleItems = group.items.filter((item) => {
            if (!item.requiredPermission) return true;
            return can(item.requiredPermission);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {group.groupTitle && (
                <h3 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {group.groupTitle}
                </h3>
              )}
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = iconMap[item.iconName] || LayoutDashboard;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    )}
                    style={isActive ? { backgroundColor: activeOrganization.primaryColor } : {}}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Global Settings & Info Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150',
            pathname === '/dashboard/settings'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          )}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Global Settings</span>
        </Link>

        <div className="flex items-center justify-between px-3 text-[10px] text-slate-500 font-medium pt-1">
          <span>Active Context</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
            {workspaceConfig.badge}
          </span>
        </div>
      </div>
    </aside>
  );
}
