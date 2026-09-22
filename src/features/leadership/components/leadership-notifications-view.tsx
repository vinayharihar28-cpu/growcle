"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import {
  getLeadershipContext,
  sendLeadershipNotification,
  getLeadershipBroadcastHistory,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipNotificationsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"ALL" | "LEADERSHIP" | "MEMBERS">("ALL");
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      if (ctx?.chapterId) {
        const hist = await getLeadershipBroadcastHistory(ctx.chapterId);
        setHistory(hist);
      }
    } catch (err) {
      console.error("Failed to load leadership notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !title || !body) return;
    setSubmitting(true);
    try {
      await sendLeadershipNotification({
        chapterId: context.chapterId,
        title,
        body,
        targetAudience: audience,
      });

      setTitle("");
      setBody("");
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
      await loadData();
    } catch (err) {
      console.error("Failed to send broadcast", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Chapter Broadcasts & Announcements</h2>
        <p className="text-sm text-muted-foreground">
          Publish announcements, meeting reminders, and alerts directly to chapter members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Compose Broadcast Announcement</h3>
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Announcement successfully dispatched to {audience.toLowerCase()} chapter members!</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Special Feature Presentation this Wednesday"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ALL">All Chapter Members & Leadership</option>
                <option value="MEMBERS">Regular Members Only</option>
                <option value="LEADERSHIP">Leadership Team Only (President, VP, Sec/Treas)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Message Body *</label>
              <textarea
                rows={5}
                required
                placeholder="Write your chapter announcement here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Dispatching..." : "Send Announcement"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips and Stats */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Broadcast Etiquette</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>Meeting reminders are best sent 24 to 36 hours before meeting day.</li>
              <li>Include speaker topics and visitor day agendas to maximize attendance.</li>
              <li>Urgent venue changes or hybrid links should target &quot;All Members&quot;.</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chapter Reach
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Total Active Members</span>
                <span className="font-bold text-foreground">26</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Leadership Officers</span>
                <span className="font-bold text-foreground">3</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Registered Guests</span>
                <span className="font-bold text-foreground">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Dispatched Announcements History</h3>
          </div>
        </div>

        <div className="divide-y divide-border">
          {history.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Bell className="h-7 w-7 text-muted-foreground/40 mx-auto" />
              <p className="text-xs font-semibold text-foreground">No Chapter Broadcasts Yet</p>
              <p className="text-[11px] text-muted-foreground">
                Announcements dispatched by your chapter leadership team will appear here in real-time.
              </p>
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="p-4 hover:bg-muted/20 transition-colors space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold text-sm text-foreground">{h.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                    {h.audience}
                  </span>
                  <span className="text-xs text-muted-foreground">{h.sentAt}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{h.body}</p>
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Delivered to {h.deliveredCount} recipients</span>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
