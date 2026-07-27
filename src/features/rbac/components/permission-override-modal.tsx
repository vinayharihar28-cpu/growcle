'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, SlidersHorizontal, Check, ShieldAlert } from 'lucide-react';
import { PermissionItem, PermissionKey, PermissionOverride } from '@/types/rbac';
import { RbacService } from '../services/rbac-service';
import { cn } from '@/lib/utils';

interface PermissionOverrideModalProps {
  memberId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PermissionOverrideModal({ memberId, isOpen, onClose, onSaved }: PermissionOverrideModalProps) {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [granted, setGranted] = useState<PermissionKey[]>([]);
  const [revoked, setRevoked] = useState<PermissionKey[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (memberId && isOpen) {
      Promise.all([RbacService.getAllPermissions(), RbacService.getUserOverride(memberId)]).then(([allPerms, override]) => {
        setPermissions(allPerms);
        if (override) {
          setGranted(override.grantedPermissions || []);
          setRevoked(override.revokedPermissions || []);
        } else {
          setGranted([]);
          setRevoked([]);
        }
      });
    }
  }, [memberId, isOpen]);

  if (!isOpen || !memberId) return null;

  const toggleGrant = (key: PermissionKey) => {
    if (granted.includes(key)) {
      setGranted(granted.filter((k) => k !== key));
    } else {
      setGranted([...granted, key]);
      setRevoked(revoked.filter((k) => k !== key)); // Cannot be both granted and revoked
    }
  };

  const toggleRevoke = (key: PermissionKey) => {
    if (revoked.includes(key)) {
      setRevoked(revoked.filter((k) => k !== key));
    } else {
      setRevoked([...revoked, key]);
      setGranted(granted.filter((k) => k !== key)); // Cannot be both granted and revoked
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await RbacService.setUserOverride({
        memberId,
        grantedPermissions: granted,
        revokedPermissions: revoked,
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6 overflow-hidden relative">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">User Permission Overrides</h3>
              <p className="text-xs text-muted-foreground">Explicitly grant or revoke specific permissions for Member ID: {memberId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {permissions.map((perm) => {
            const isExplicitGrant = granted.includes(perm.key);
            const isExplicitRevoke = revoked.includes(perm.key);

            return (
              <div key={perm.key} className="flex items-center justify-between p-3 rounded-xl border bg-background hover:bg-accent/40 text-xs">
                <div>
                  <div className="font-bold text-foreground">{perm.label}</div>
                  <div className="text-[11px] text-muted-foreground">{perm.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleGrant(perm.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all',
                      isExplicitGrant
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'bg-accent/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Grant
                  </button>

                  <button
                    onClick={() => toggleRevoke(perm.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all',
                      isExplicitRevoke
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-accent/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {saving ? 'Saving Overrides...' : 'Save User Overrides'}
          </Button>
        </div>
      </div>
    </div>
  );
}
