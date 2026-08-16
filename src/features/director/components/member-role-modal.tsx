"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, X } from "lucide-react";
import { changeDirectorMemberRole } from "../actions/director-actions";

interface MemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: string;
    name: string;
    email: string;
    chapterId: string;
    chapterName: string;
    currentRole: string;
  } | null;
  onSuccess?: () => void;
}

export function MemberRoleModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: MemberRoleModalProps) {
  const [newRole, setNewRole] = useState<"MEMBER" | "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER">("MEMBER");
  const [step, setStep] = useState<"SELECT" | "CONFIRM">("SELECT");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !member) return null;

  const handleNext = () => {
    if (newRole === member.currentRole) {
      onClose();
      return;
    }
    setStep("CONFIRM");
  };

  const handleConfirmChange = async () => {
    setLoading(true);
    try {
      await changeDirectorMemberRole({
        memberId: member.id,
        newRole,
        chapterId: member.chapterId,
      });
      onSuccess?.();
      onClose();
      setStep("SELECT");
    } catch (err) {
      console.error("Failed to update member role", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Change Member Role
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "SELECT" ? (
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Target Member</span>
              <p className="font-bold text-base text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email} • {member.chapterName}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Current Role
              </label>
              <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
                {member.currentRole}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Select New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
              >
                <option value="MEMBER">Standard Member</option>
                <option value="PRESIDENT">Chapter President (Leadership)</option>
                <option value="VICE_PRESIDENT">Chapter Vice President (Leadership)</option>
                <option value="TREASURER">Chapter Treasurer (Leadership)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={onClose}
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Proceed to Review
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Confirm Sensitive Action
              </div>
              <p className="text-xs">
                You are about to change <strong>{member.name}</strong> from <strong>{member.currentRole}</strong> to <strong>{newRole}</strong> in chapter <strong>{member.chapterName}</strong>.
              </p>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground border-t border-b py-3">
              <p>• Role changes are recorded in the audit log.</p>
              <p>• Leadership permissions for this chapter will take effect immediately.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStep("SELECT")}
                disabled={loading}
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Back
              </button>
              <button
                onClick={handleConfirmChange}
                disabled={loading}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Confirm Role Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
