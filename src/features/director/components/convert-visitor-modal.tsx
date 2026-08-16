"use client";

import React, { useState } from "react";
import { UserPlus, CheckCircle2, X } from "lucide-react";
import { convertDirectorVisitorToMember } from "../actions/director-actions";

interface ConvertVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor: {
    id: string;
    name: string;
    email: string;
    company: string;
    chapterId: string;
    chapterName: string;
  } | null;
  onSuccess?: () => void;
}

export function ConvertVisitorModal({
  isOpen,
  onClose,
  visitor,
  onSuccess,
}: ConvertVisitorModalProps) {
  const [membershipNumber, setMembershipNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !visitor) return null;

  const handleConvert = async () => {
    setLoading(true);
    try {
      await convertDirectorVisitorToMember({
        visitorId: visitor.id,
        chapterId: visitor.chapterId,
        membershipNumber: membershipNumber || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to convert visitor", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-emerald-500" />
            Convert Visitor to Member
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Visitor Candidate</span>
            <p className="font-bold text-base text-foreground">{visitor.name}</p>
            <p className="text-xs text-muted-foreground">{visitor.email} • {visitor.company}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Target Chapter: {visitor.chapterName}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Membership Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GC-SVF-109"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
            <span className="text-[11px] text-muted-foreground">Will be auto-generated if left blank.</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              disabled={loading}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Converting..." : "Complete Conversion"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
