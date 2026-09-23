"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, X, Shield, Crown, UserCheck } from "lucide-react";
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
  chapters?: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function MemberRoleModal({
  isOpen,
  onClose,
  member,
  chapters = [],
  onSuccess,
}: MemberRoleModalProps) {
  const [newRole, setNewRole] = useState<"MEMBER" | "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER" | "DIRECTOR">("MEMBER");
  const [targetChapterId, setTargetChapterId] = useState<string>("");
  const [step, setStep] = useState<"SELECT" | "CONFIRM">("SELECT");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (member) {
      setNewRole((["MEMBER", "PRESIDENT", "VICE_PRESIDENT", "TREASURER", "DIRECTOR"].includes(member.currentRole) ? member.currentRole : "MEMBER") as any);
      setTargetChapterId(member.chapterId || (chapters[0]?.id || ""));
      setStep("SELECT");
    }
  }, [member, chapters]);

  if (!isOpen || !member) return null;

  const handleNext = () => {
    if (newRole === member.currentRole && (!targetChapterId || targetChapterId === member.chapterId)) {
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
        targetChapterId: targetChapterId || member.chapterId,
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

  const targetChapterName = chapters.find((c) => c.id === targetChapterId)?.name || member.chapterName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Assign Role & Governance
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "SELECT" ? (
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Target Member</span>
              <p className="font-bold text-base text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email} • Current Chapter: {member.chapterName}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Current Active Role
              </label>
              <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-bold text-foreground">
                {member.currentRole}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Select New Position / Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary"
              >
                <option value="DIRECTOR">🌟 Chapter Director / Area Director (Director Console Access)</option>
                <option value="PRESIDENT">👑 Chapter President (Leadership Team Console)</option>
                <option value="VICE_PRESIDENT">🛡️ Chapter Vice President (Leadership Team Console)</option>
                <option value="TREASURER">💼 Chapter Treasurer (Leadership Team Console)</option>
                <option value="MEMBER">👤 Standard Member (Member App Access)</option>
              </select>
            </div>

            {chapters.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Assigned Chapter
                </label>
                <select
                  value={targetChapterId}
                  onChange={(e) => setTargetChapterId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={onClose}
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
                Confirm Role & Governance Assignment
              </div>
              <p className="text-xs">
                You are about to assign <strong>{member.name}</strong> to <strong>{newRole}</strong> in chapter <strong>{targetChapterName}</strong>.
              </p>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground border-t border-b py-3">
              {newRole === "DIRECTOR" && (
                <p className="text-primary font-semibold">• This member will receive Director access across assigned chapter operations.</p>
              )}
              {["PRESIDENT", "VICE_PRESIDENT", "TREASURER"].includes(newRole) && (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">• This member will be placed in the Chapter Leadership Team console for {targetChapterName}.</p>
              )}
              <p>• Role changes are recorded in the system audit logs.</p>
              <p>• Permissions will take effect immediately upon confirmation.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStep("SELECT")}
                disabled={loading}
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleConfirmChange}
                disabled={loading}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
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
