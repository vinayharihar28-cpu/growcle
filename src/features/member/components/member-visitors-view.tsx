"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Plus, Calendar, Mail, Phone, Building2, CheckCircle2, Clock, Edit3, MessageSquare } from "lucide-react";
import {
  getMemberContext,
  getMemberVisitors,
  inviteMemberVisitor,
  updateMemberVisitor,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { VisitorStatus } from "@prisma/client";

export function MemberVisitorsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Follow-up modal
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const [followUpForm, setFollowUpForm] = useState({
    status: "PENDING" as VisitorStatus,
    notes: "",
  });
  const [followUpSubmitting, setFollowUpSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const data = await getMemberVisitors(ctx.memberId);
      setVisitors(data);
    } catch (err) {
      console.error("Failed to load visitors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !form.firstName || !form.email) return;
    setSubmitting(true);
    try {
      await inviteMemberVisitor({
        memberId: context.memberId,
        chapterId: context.chapterId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        industry: form.industry,
        visitDate: new Date(form.visitDate),
        notes: form.notes,
      });
      setIsInviteOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to invite visitor", err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalInvited = visitors.length;
  const attendedCount = visitors.filter((v) => v.status === "ATTENDED").length;
  const convertedCount = visitors.filter((v) => v.status === "CONVERTED").length;

  const handleOpenFollowUp = (v: any) => {
    setSelectedVisitor(v);
    setFollowUpForm({
      status: v.status as VisitorStatus,
      notes: v.notes || "",
    });
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !selectedVisitor) return;
    setFollowUpSubmitting(true);
    try {
      await updateMemberVisitor(selectedVisitor.id, context.memberId, {
        status: followUpForm.status,
        notes: followUpForm.notes,
      });
      setSelectedVisitor(null);
      setSuccessToast(`Follow-up saved for ${selectedVisitor.name}!`);
      setTimeout(() => setSuccessToast(null), 4000);
      await loadData();
    } catch (err) {
      console.error("Failed to update visitor follow-up", err);
    } finally {
      setFollowUpSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Invited Chapter Visitors</h2>
          <p className="text-sm text-muted-foreground">
            Introduce potential members to your chapter and track their visit lifecycle.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Invite New Visitor</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Guests Invited</span>
          <p className="text-2xl font-bold text-foreground mt-1">{totalInvited}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attended Sessions</span>
          <p className="text-2xl font-bold text-blue-500 mt-1">{attendedCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inducted as Members</span>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{convertedCount}</p>
        </div>
      </div>

      {/* Visitors List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Invited Visitors Pipeline</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {visitors.length} guests
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading invited visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <p>You haven&apos;t invited any guests to {context?.chapterName} yet.</p>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Invite your first guest today →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Business & Sector</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Scheduled Visit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{v.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{v.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-foreground">{v.company}</div>
                      <div className="text-muted-foreground">{v.industry}</div>
                    </td>
                    <td className="py-3 px-4 text-xs space-y-0.5">
                      <div className="text-foreground">{v.email}</div>
                      <div className="text-muted-foreground">{v.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {v.visitDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          v.status === "CONVERTED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : v.status === "ATTENDED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenFollowUp(v)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Follow Up</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Visitor Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Invite Chapter Visitor</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email Address (Google/Verified) *</label>
                  <input
                    type="email"
                    required
                    placeholder="visitor@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Corporate Law / Marketing"
                    required
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Scheduled Visit Date</label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes / Discussion Topics</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Visitor background, interests, guest of..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Inviting..." : "Send Guest Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Follow-up Note & Status Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Follow Up: {selectedVisitor.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedVisitor.company} • {selectedVisitor.email}</p>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFollowUpSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Guest Visit Status</label>
                <select
                  value={followUpForm.status}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, status: e.target.value as VisitorStatus })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="PENDING">PENDING — Invited / Awaiting Meeting</option>
                  <option value="CONFIRMED">CONFIRMED — Confirmed Attendance</option>
                  <option value="ATTENDED">ATTENDED — Attended Chapter Meeting</option>
                  <option value="CONVERTED">CONVERTED — Joined as Chapter Member</option>
                  <option value="CANCELLED">CANCELLED — Unable to Attend</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Follow-up Notes & Feedback</label>
                <textarea
                  rows={4}
                  value={followUpForm.notes}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                  placeholder="Record post-meeting discussion notes, mutual impressions, or membership interest..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={followUpSubmitting}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {followUpSubmitting ? "Saving..." : "Save Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
