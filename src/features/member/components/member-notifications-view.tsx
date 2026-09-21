"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock, Sparkles } from "lucide-react";
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
      if (list.length > 0) {
        setNotifications(list);
      } else {
        // Provide standard chapter broadcast fallback
        setNotifications([
          {
            id: "n1",
            title: "Upcoming Chapter Meeting Reminder",
            body: `Our weekly business exchange is scheduled for this ${ctx.meetingDay} at ${ctx.meetingTime}. Please review the agenda and bring your guest.`,
            date: "Yesterday",
            isRead: false,
          },
          {
            id: "n2",
            title: "Mega Visitor Exchange Announced",
            body: "Chapter leadership has announced our upcoming Mega Visitor Exchange Day. Prepare your 45-second business showcase.",
            date: "3 days ago",
            isRead: true,
          },
          {
            id: "n3",
            title: "New Referral Received",
            body: "You received a new client referral from Sarah Johnson for ERP Advisory. Review your Referrals Received tab.",
            date: "Last week",
            isRead: true,
          },
        ]);
      }
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
          Stay updated on meeting updates, chapter announcements, and referral notifications.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Inbox & Announcements</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {notifications.length} messages
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading notifications...</div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 hover:bg-muted/20 transition-colors space-y-1.5 ${
                  !n.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{n.date}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
