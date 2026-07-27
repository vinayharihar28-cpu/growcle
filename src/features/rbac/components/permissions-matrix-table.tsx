'use client';

import { Fragment } from 'react';
import { RoleDefinition, PermissionItem, PermissionKey } from '@/types/rbac';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PermissionsMatrixTableProps {
  roles: RoleDefinition[];
  permissions: PermissionItem[];
  onTogglePermission: (roleCode: string, permissionKey: PermissionKey) => void;
}

export function PermissionsMatrixTable({ roles, permissions, onTogglePermission }: PermissionsMatrixTableProps) {
  // Group permissions by category
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-base text-foreground">Interactive Permissions Matrix</h3>
        <p className="text-xs text-muted-foreground">
          Toggle permissions on or off per role. Changes take effect instantly across all workspace contexts.
        </p>
      </div>

      <div className="border rounded-2xl bg-card overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/60 border-b text-[11px] font-bold text-muted-foreground uppercase">
            <tr>
              <th className="p-4 min-w-[240px] sticky left-0 bg-muted/90 backdrop-blur-xs z-10">Permission Name & Action</th>
              {roles.map((r) => (
                <th key={r.code} className="p-4 text-center min-w-[130px]">
                  <div className="font-bold text-foreground capitalize">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono font-normal">{r.code}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => {
              const categoryPermissions = permissions.filter((p) => p.category === cat);

              return (
                <Fragment key={cat}>
                  {/* Category Header Row */}
                  <tr className="bg-accent/40 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    <td colSpan={roles.length + 1} className="px-4 py-2 uppercase tracking-wider text-[10px] bg-accent/60">
                      Category: {cat}
                    </td>
                  </tr>

                  {categoryPermissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4 sticky left-0 bg-card z-10 border-r">
                        <div className="font-bold text-foreground text-xs">{perm.label}</div>
                        <div className="text-[11px] text-muted-foreground">{perm.description}</div>
                        <span className="text-[10px] font-mono text-slate-400">{perm.key}</span>
                      </td>

                      {roles.map((r) => {
                        const isGranted = r.permissions.includes(perm.key);
                        const isSuperAdmin = r.code === 'SUPER_ADMIN';

                        return (
                          <td key={r.code} className="p-4 text-center border-r">
                            <button
                              disabled={isSuperAdmin}
                              onClick={() => onTogglePermission(r.code, perm.key)}
                              className={cn(
                                'mx-auto w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 border',
                                isGranted
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20',
                                isSuperAdmin && 'opacity-70 cursor-not-allowed bg-emerald-500/20 text-emerald-600'
                              )}
                              title={isSuperAdmin ? 'Super Admin permissions cannot be revoked' : `Toggle ${perm.label} for ${r.name}`}
                            >
                              {isGranted ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5 opacity-40" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
