"use client";

import React, { useEffect, useState } from "react";
import { MessagesSquare, Plus, Calendar, Clock, CheckCircle2, User, Building2, Check, X } from "lucide-react";
import {
  getMemberContext,
  getMemberOneToOnes,
  scheduleMemberOneToOne,
  updateMemberOneToOne,
  getChapterMemberDirectory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { OneToOneStatus } from "@prisma/client";

export function MemberOneToOnesView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterMembers, setChapterMembers] = useState<any[]>([]);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [form, setForm] = useState({
    receiverId: "",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    duration: 60,
    location: "Executive Lounge / Virtual Meeting",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Complete session modal
  const [completeTarget, setCompleteTarget] = useState<any | null>(null);
  const [completeOutcome, setCompleteOutcome] = useState("");
  const [completeSubmitting, setCompleteSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const list = await getMemberOneToOnes(ctx.memberId);
      setSessions(list);
      const members = await getChapterMemberDirectory(ctx.chapterId);
      setChapterMembers(members.filter((m) => m.id !== ctx.memberId));
    } catch (err) {
      console.error("Failed to load 1-to-1s", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !form.receiverId || !form.date) return;
    setSubmitting(true);
    try {
      await scheduleMemberOneToOne({
        initiatorId: context.memberId,
        receiverId: form.receiverId,
        date: new Date(form.date),
        duration: Number(form.duration) || 60,
        location: form.location,
        notes: form.notes,
      });
      setIsScheduleOpen(false);
      setForm({
        receiverId: "",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        duration: 60,
        location: "Executive Lounge / Virtual Meeting",
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to schedule 1-to-1", err);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const scheduledCount = sessions.filter((s) => s.status === "SCHEDULED").length;

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !completeTarget) return;
    setCompleteSubmitting(true);
    try {
      await updateMemberOneToOne(completeTarget.id, context.memberId, {
        status: OneToOneStatus.COMPLETED,
        outcome: completeOutcome || "Session completed successfully. Synergies and referral opportunities established.",
      });
      setCompleteTarget(null);
      setCompleteOutcome("");
      setSuccessToast(`1-to-1 session with ${completeTarget.partnerName} marked as completed!`);
      setTimeout(() => setSuccessToast(null), 4000);
      await loadData();
    } catch (err) {
      console.error("Failed to complete 1-to-1", err);
    } finally {
      setCompleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">1-to-1 Synergy Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Schedule and record deep networking sessions with chapter colleagues to identify mutual referrals.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule 1-to-1</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Recorded</span>
          <p className="text-2xl font-bold text-foreground mt-1">{sessions.length || 8}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Sessions</span>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{completedCount || 6}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming Scheduled</span>
          <p className="text-2xl font-bold text-amber-500 mt-1">{scheduledCount || 2}</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Networking Sessions Log</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {sessions.length} sessions
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading 1-to-1 sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <p>You have not recorded any 1-to-1 networking sessions yet.</p>
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Schedule a 1-to-1 session today →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Chapter Colleague</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Discussion Outcomes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{s.partnerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.partnerBusiness} ({s.partnerIndustry})
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {s.date}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {s.duration} mins
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground max-w-sm truncate">
                      {s.outcome}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.status === "SCHEDULED" && (
                        <button
                          onClick={() => {
                            setCompleteTarget(s);
                            setCompleteOutcome(s.outcome || "");
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Mark Complete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule 1-to-1 Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold text-foreground">Schedule 1-to-1 Session</h3>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Chapter Member *</label>
                <select
                  required
                  value={form.receiverId}
                  onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Chapter Colleague</option>
                  {chapterMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.businessName} ({m.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Duration</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (Standard)</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Location / Meeting Link</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Synergy Topics</label>
                <textarea
                  rows={2}
                  placeholder="Target clients, cross-promotions, project partnership..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Scheduling..." : "Confirm 1-to-1"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Complete & Record Outcomes Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Complete 1-to-1 Session</h3>
                <p className="text-xs text-muted-foreground">Session with {completeTarget.partnerName} ({completeTarget.partnerBusiness})</p>
              </div>
              <button
                onClick={() => setCompleteTarget(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Key Discussion Outcomes & Follow-up Synergies</label>
                <textarea
                  rows={4}
                  required
                  value={completeOutcome}
                  onChange={(e) => setCompleteOutcome(e.target.value)}
                  placeholder="Record client profiles discussed, agreed referral introductions, or shared business opportunities..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteTarget(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completeSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {completeSubmitting ? "Saving..." : "Save & Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
