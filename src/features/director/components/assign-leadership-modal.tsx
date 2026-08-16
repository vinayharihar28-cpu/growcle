"use client";

import React, { useState } from "react";
import { UserCheck, AlertTriangle, X } from "lucide-react";
import { assignDirectorLeadership } from "../actions/director-actions";

interface AssignLeadershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterName: string;
  initialPosition?: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  availableMembers: { id: string; name: string; email: string }[];
  onSuccess?: () => void;
}

export function AssignLeadershipModal({
  isOpen,
  onClose,
  chapterId,
  chapterName,
  initialPosition = "PRESIDENT",
  availableMembers,
  onSuccess,
}: AssignLeadershipModalProps) {
  const [position, setPosition] = useState<"PRESIDENT" | "VICE_PRESIDENT" | "TREASURER">(initialPosition);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedMemberId) return;
    setLoading(true);
    try {
      await assignDirectorLeadership({
        chapterId,
        position,
        memberId: selectedMemberId,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to assign leadership position", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <UserCheck className="h-5 w-5 text-primary" />
            Assign Leadership Position
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Target Chapter</span>
            <p className="font-bold text-base text-foreground">{chapterName}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Select Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
            >
              <option value="PRESIDENT">President</option>
              <option value="VICE_PRESIDENT">Vice President</option>
              <option value="TREASURER">Treasurer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Select Active Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Choose Member --</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p>• Assigning this leadership role will update chapter governance access and notifications.</p>
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
              onClick={handleAssign}
              disabled={!selectedMemberId || loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Assigning..." : `Assign ${position}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
