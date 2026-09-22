"use client";

import React, { useEffect, useState } from "react";
import { Bell, Send, Plus, CheckCircle2 } from "lucide-react";
import { getAssignedChapters, getDirectorBroadcastHistory } from "../actions/director-actions";
import { SendNotificationModal } from "./send-notification-modal";

export function NotificationsManagementView() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentHistory, setSentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chaps, history] = await Promise.all([
        getAssignedChapters(),
        getDirectorBroadcastHistory(),
      ]);
      setChapters(chaps);
      setSentHistory(history);
    } catch (err) {
      console.error("Failed to load director notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
        {sentHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2 border-t border-b">
            <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No Broadcasts Sent Yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Use the Dispatch Announcement button above to send official memos, meeting updates, or guidelines to your chapter members.
            </p>
          </div>
        ) : (
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
        )}
      </div>

      <SendNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapters={chapters}
        onSuccess={loadData}
      />
    </div>
  );
}
