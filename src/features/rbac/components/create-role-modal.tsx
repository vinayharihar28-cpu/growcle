'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, ShieldPlus, Check } from 'lucide-react';
import { RoleDefinition, RoleScope, PermissionItem, PermissionKey } from '@/types/rbac';
import { cn } from '@/lib/utils';

interface CreateRoleModalProps {
  isOpen: boolean;
  permissions: PermissionItem[];
  onClose: () => void;
  onSubmit: (data: Omit<RoleDefinition, 'id' | 'memberCount' | 'isCustom'>) => Promise<unknown>;
}

export function CreateRoleModal({ isOpen, permissions, onClose, onSubmit }: CreateRoleModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<RoleScope>('CHAPTER');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const togglePermission = (key: PermissionKey) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((k) => k !== key));
    } else {
      setSelectedPermissions([...selectedPermissions, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name,
        code: code.toUpperCase().replace(/\s+/g, '_'),
        description,
        scope,
        permissions: selectedPermissions,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 overflow-hidden relative">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Create Custom System Role</h3>
              <p className="text-xs text-muted-foreground">Define role name, scope, and initial permissions list</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter Event Host"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setCode(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role Code Identifier *</label>
              <input
                type="text"
                required
                placeholder="CHAPTER_EVENT_HOST"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as RoleScope)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="CHAPTER">Chapter Level Scope</option>
                <option value="ORGANIZATION">Organization Level Scope</option>
                <option value="GLOBAL">Global Tenant Scope</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Granted Count</label>
              <div className="px-3 py-2 rounded-lg border bg-muted/40 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {selectedPermissions.length} / {permissions.length} Permissions
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <input
              type="text"
              placeholder="Describe the duties and privileges of this custom role..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="text-xs font-semibold text-foreground block">Assign Permissions</label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {permissions.map((p) => {
                const isSelected = selectedPermissions.includes(p.key);
                return (
                  <div
                    key={p.key}
                    onClick={() => togglePermission(p.key)}
                    className={cn(
                      'p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors',
                      isSelected ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-background hover:bg-accent/40'
                    )}
                  >
                    <div>
                      <span className="font-semibold block">{p.label}</span>
                      <span className="text-[10px] text-muted-foreground">{p.description}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {submitting ? 'Creating Role...' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
