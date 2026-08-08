'use client';

import { Shield, KeyRound, Users, Plus, Check } from 'lucide-react';
import { RoleDefinition } from '@/types/rbac';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils';

interface RolesGridProps {
  roles: RoleDefinition[];
  onOpenCreateRole: () => void;
}

export function RolesGrid({ roles, onOpenCreateRole }: RolesGridProps) {
  const getScopeBadge = (scope: RoleDefinition['scope']) => {
    switch (scope) {
      case 'GLOBAL':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">Global Scope</span>;
      case 'ORGANIZATION':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">Org Scope</span>;
      case 'CHAPTER':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">Chapter Scope</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base text-foreground">Configured System Roles</h3>
          <p className="text-xs text-muted-foreground">System default roles and custom organizational access roles</p>
        </div>
        <Button onClick={onOpenCreateRole} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl border bg-card space-y-4 shadow-xs hover:border-indigo-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    {r.name}
                    {r.isCustom && <span className="text-[9px] bg-accent px-1.5 py-0.5 rounded font-medium">Custom</span>}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-mono">{r.code}</p>
                </div>
              </div>
              {getScopeBadge(r.scope)}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{r.description}</p>

            <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <strong className="text-foreground">{r.memberCount}</strong> Members Assigned
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {r.permissions.length} Permissions Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
