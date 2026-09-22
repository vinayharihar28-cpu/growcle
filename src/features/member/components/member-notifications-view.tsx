"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import {
  getMemberContext,
  getMemberNotifications,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberNotificationsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const list = await getMemberNotifications(ctx.memberId, ctx.chapterId);
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div>
        <h2 className="text-xl font-bold text-foreground">Announcements & Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Real-time chapter announcements, meeting alerts, and business referral notifications.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-foreground">Inbox & Announcements</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">You&apos;re all caught up!</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No notifications at this time. Chapter broadcasts, meeting reminders, and referral updates will appear here dynamically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 hover:bg-muted/20 transition-colors space-y-1.5 ${
                  !n.isRead ? "bg-indigo-500/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{n.message || n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
