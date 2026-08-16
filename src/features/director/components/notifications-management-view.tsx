"use client";

import React, { useEffect, useState } from "react";
import { Bell, Send, Plus, CheckCircle2 } from "lucide-react";
import { getAssignedChapters } from "../actions/director-actions";
import { SendNotificationModal } from "./send-notification-modal";

export function NotificationsManagementView() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentHistory, setSentHistory] = useState<any[]>([
    {
      id: "notif-1",
      title: "Regional Leadership Strategy Session",
      chapterName: "All Assigned Chapters",
      audience: "LEADERSHIP",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      recipients: 18,
    },
    {
      id: "notif-2",
      title: "Quarterly Visitor Day Guidelines",
      chapterName: "Silicon Valley Founders",
      audience: "ALL",
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      recipients: 42,
    },
  ]);

  useEffect(() => {
    async function load() {
      const chaps = await getAssignedChapters();
      setChapters(chaps);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Chapter Broadcasts</h2>
          <p className="text-muted-foreground">Send official announcements, leadership memos, and regional notifications to assigned chapters.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 self-start md:self-auto"
        >
          <Send className="h-4 w-4" /> Dispatch Announcement
        </button>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-foreground">Recent Sent Announcements</h3>
        <div className="divide-y border-t border-b">
          {sentHistory.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-base text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Scope: {item.chapterName} • Audience: {item.audience} • Sent: {new Date(item.date).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched ({item.recipients} Recipients)
              </span>
            </div>
          ))}
        </div>
      </div>

      <SendNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapters={chapters}
        onSuccess={() => {
          setSentHistory((prev) => [
            {
              id: `notif-${Date.now()}`,
              title: "Chapter Director Broadcast",
              chapterName: "Assigned Scope",
              audience: "ALL",
              date: new Date().toISOString(),
              recipients: 35,
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
