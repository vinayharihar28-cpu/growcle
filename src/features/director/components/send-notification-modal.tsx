"use client";

import React, { useState } from "react";
import { Bell, Send, X } from "lucide-react";
import { sendDirectorChapterNotification, ChapterSummary } from "../actions/director-actions";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: ChapterSummary[];
  onSuccess?: () => void;
}

export function SendNotificationModal({
  isOpen,
  onClose,
  chapters,
  onSuccess,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [chapterId, setChapterId] = useState("all");
  const [targetAudience, setTargetAudience] = useState<"ALL" | "LEADERSHIP" | "MEMBERS">("ALL");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!title || !body) return;
    setLoading(true);
    try {
      await sendDirectorChapterNotification({
        title,
        body,
        chapterId,
        targetAudience,
      });
      onSuccess?.();
      onClose();
      setTitle("");
      setBody("");
    } catch (err) {
      console.error("Failed to send notification", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Send Chapter Announcement
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Target Scope / Chapter
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Assigned Chapters</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Recipient Role Target
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Chapter Members</option>
              <option value="LEADERSHIP">Leadership Team Only (Presidents, VPs, Treasurers)</option>
              <option value="MEMBERS">Standard Members Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Quarterly Regional Leadership Summit Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Message Content *
            </label>
            <textarea
              rows={4}
              placeholder="Type your official announcement here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
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
              onClick={handleSend}
              disabled={!title || !body || loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Dispatch Broadcast"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
