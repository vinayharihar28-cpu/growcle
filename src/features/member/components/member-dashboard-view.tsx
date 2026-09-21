"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Handshake,
  UserPlus,
  MessagesSquare,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  Send,
  Plus,
} from "lucide-react";
import {
  getMemberContext,
  getMemberDashboardData,
  giveMemberReferral,
  inviteMemberVisitor,
  scheduleMemberOneToOne,
  recordSelfAttendance,
  getChapterMemberDirectory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberDashboardView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapterMembers, setChapterMembers] = useState<any[]>([]);

  // Modals
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [isOneToOneOpen, setIsOneToOneOpen] = useState(false);

  // Forms
  const [referralForm, setReferralForm] = useState({
    toMemberId: "",
    referralName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: 0,
    notes: "",
  });

  const [visitorForm, setVisitorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  });

  const [oneToOneForm, setOneToOneForm] = useState({
    receiverId: "",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    duration: 60,
    location: "Executive Lounge / Virtual Meeting",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [checkInPending, startCheckIn] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const dash = await getMemberDashboardData(ctx.memberId);
      setData(dash);
      const members = await getChapterMemberDirectory(ctx.chapterId);
      setChapterMembers(members.filter((m) => m.id !== ctx.memberId));
    } catch (err) {
      console.error("Failed to load member dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckIn = () => {
    if (!context || !data?.upcomingMeeting?.id) return;
    startCheckIn(async () => {
      try {
        await recordSelfAttendance(data.upcomingMeeting.id, context.memberId);
        setData((prev: any) => ({
          ...prev,
          upcomingMeeting: {
            ...prev.upcomingMeeting,
            hasCheckedIn: true,
          },
        }));
      } catch (err) {
        console.error("Check in failed", err);
      }
    });
  };

  const handleGiveReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !referralForm.toMemberId || !referralForm.referralName) return;
    setSubmitting(true);
    try {
      await giveMemberReferral({
        fromMemberId: context.memberId,
        toMemberId: referralForm.toMemberId,
        chapterId: context.chapterId,
        referralName: referralForm.referralName,
        clientName: referralForm.clientName,
        clientEmail: referralForm.clientEmail,
        clientPhone: referralForm.clientPhone,
        value: Number(referralForm.value) || 0,
        notes: referralForm.notes,
      });
      setIsReferralOpen(false);
      setReferralForm({
        toMemberId: "",
        referralName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        value: 0,
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to submit referral", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInviteVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !visitorForm.firstName || !visitorForm.email) return;
    setSubmitting(true);
    try {
      await inviteMemberVisitor({
        memberId: context.memberId,
        chapterId: context.chapterId,
        firstName: visitorForm.firstName,
        lastName: visitorForm.lastName,
        email: visitorForm.email,
        phone: visitorForm.phone,
        company: visitorForm.company,
        industry: visitorForm.industry,
        visitDate: new Date(visitorForm.visitDate),
        notes: visitorForm.notes,
      });
      setIsVisitorOpen(false);
      setVisitorForm({
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

  const handleScheduleOneToOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !oneToOneForm.receiverId || !oneToOneForm.date) return;
    setSubmitting(true);
    try {
      await scheduleMemberOneToOne({
        initiatorId: context.memberId,
        receiverId: oneToOneForm.receiverId,
        date: new Date(oneToOneForm.date),
        duration: Number(oneToOneForm.duration) || 60,
        location: oneToOneForm.location,
        notes: oneToOneForm.notes,
      });
      setIsOneToOneOpen(false);
      setOneToOneForm({
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

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Quick Actions Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Networking Quick Actions</h3>
            <p className="text-xs text-muted-foreground">What do you want to accomplish today?</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsReferralOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <Handshake className="h-4 w-4" />
              <span>Give Referral</span>
            </button>

            <button
              onClick={() => setIsVisitorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-card border border-border text-foreground font-semibold text-xs hover:bg-muted transition-colors shadow-sm"
            >
              <UserPlus className="h-4 w-4 text-emerald-500" />
              <span>Invite Visitor</span>
            </button>

            <button
              onClick={() => setIsOneToOneOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-card border border-border text-foreground font-semibold text-xs hover:bg-muted transition-colors shadow-sm"
            >
              <MessagesSquare className="h-4 w-4 text-blue-500" />
              <span>Schedule 1-to-1</span>
            </button>

            <Link
              href="/dashboard/member/business"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-muted text-muted-foreground font-medium text-xs hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              <span>Edit Business</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Attendance */}
        <Link
          href="/dashboard/member/attendance"
          className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{data?.kpis.attendanceRate || 0}%</span>
            <span className="text-xs text-emerald-500 font-semibold">Reliable</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Meeting participation</p>
        </Link>

        {/* Referrals */}
        <Link
          href="/dashboard/member/referrals"
          className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Referrals</span>
            <Handshake className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {data?.kpis.referralsGiven || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              given / {data?.kpis.referralsReceived || 0} recv
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Total passed opportunities</p>
        </Link>

        {/* Closed Business */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Closed Business</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {formatINR(data?.kpis.closedBusinessGenerated || 0)}
          </div>
          <p className="text-[11px] text-muted-foreground">Partner-verified revenue</p>
        </div>

        {/* 1-to-1s & Visitors */}
        <Link
          href="/dashboard/member/one-to-ones"
          className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Synergy 1-to-1s</span>
            <MessagesSquare className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {data?.kpis.completedOneToOnes || 0}
            </span>
            <span className="text-xs text-amber-500 font-medium">
              ({data?.kpis.scheduledOneToOnes || 0} upcoming)
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">In-depth peer collaborations</p>
        </Link>
      </div>

      {/* Hero: Next Chapter Meeting & Self-Attendance */}
      {data?.upcomingMeeting && (
        <div className="bg-gradient-to-br from-card via-card to-primary/10 border-2 border-primary/20 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Upcoming Chapter Meeting
                </span>
                <span className="text-xs text-muted-foreground">• Weekly Exchange</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{data.upcomingMeeting.title}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{data.upcomingMeeting.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{data.upcomingMeeting.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{data.upcomingMeeting.location}</span>
                </div>
              </div>
            </div>

            {/* Self Attendance Check-In Button */}
            <div className="flex items-center gap-3">
              {data.upcomingMeeting.hasCheckedIn ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Checked In (Present)</span>
                </div>
              ) : (
                <button
                  disabled={checkInPending}
                  onClick={handleCheckIn}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{checkInPending ? "Confirming..." : "Mark Myself Present"}</span>
                </button>
              )}

              <Link
                href="/dashboard/member/meetings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-3 py-2 rounded-lg bg-primary/10"
              >
                <span>View Run-Sheet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/80 text-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-muted-foreground">Keynote Speaker: </span>
                <strong className="text-foreground">{data.upcomingMeeting.speaker}</strong>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Session Focus: </span>
              <span className="text-foreground italic">&ldquo;{data.upcomingMeeting.theme}&rdquo;</span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline and Discovery Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Networking Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recent Networking Activity</h3>
            </div>
            <Link
              href="/dashboard/member/reports"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>View Scorecard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {(data?.recentActivity || []).map((act: any) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {act.type === "REFERRAL" ? (
                      <Handshake className="h-4 w-4" />
                    ) : act.type === "ONE_TO_ONE" ? (
                      <MessagesSquare className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{act.title}</p>
                    <p className="text-xs text-muted-foreground">{act.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{act.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Member Discovery Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Users className="h-5 w-5" />
              <span>Chapter Discovery</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Explore your chapter members, understand their services, and pass qualified client opportunities.
            </p>

            <div className="bg-muted/40 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Chapter Peers</span>
                <span className="font-bold text-foreground">{chapterMembers.length} members</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">My Invited Guests</span>
                <span className="font-bold text-foreground">{data?.kpis.visitorsInvited || 0}</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/member/members"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors"
          >
            <span>Open Members Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Give Referral Modal */}
      {isReferralOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Give Chapter Referral</h3>
              </div>
              <button
                onClick={() => setIsReferralOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGiveReferral} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Referral To Member *</label>
                <select
                  required
                  value={referralForm.toMemberId}
                  onChange={(e) => setReferralForm({ ...referralForm, toMemberId: e.target.value })}
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

              <div>
                <label className="text-xs font-medium text-muted-foreground">Referral Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ERP Software Implementation for Supply Chain"
                  value={referralForm.referralName}
                  onChange={(e) => setReferralForm({ ...referralForm, referralName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Potential Client / Business</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial Systems"
                    value={referralForm.clientName}
                    onChange={(e) => setReferralForm({ ...referralForm, clientName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estimated Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={referralForm.value || ""}
                    onChange={(e) => setReferralForm({ ...referralForm, value: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Contact Email</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={referralForm.clientEmail}
                    onChange={(e) => setReferralForm({ ...referralForm, clientEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={referralForm.clientPhone}
                    onChange={(e) => setReferralForm({ ...referralForm, clientPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes & Synergy Details</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this client is ready to talk, expected timelines..."
                  value={referralForm.notes}
                  onChange={(e) => setReferralForm({ ...referralForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsReferralOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Passing..." : "Give Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Visitor Modal */}
      {isVisitorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-foreground">Invite Guest / Visitor</h3>
              </div>
              <button
                onClick={() => setIsVisitorOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteVisitor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.firstName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={visitorForm.lastName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={visitorForm.email}
                    onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
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
                    value={visitorForm.company}
                    onChange={(e) => setVisitorForm({ ...visitorForm, company: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Architecture"
                    value={visitorForm.industry}
                    onChange={(e) => setVisitorForm({ ...visitorForm, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Target Meeting Date</label>
                <input
                  type="date"
                  value={visitorForm.visitDate}
                  onChange={(e) => setVisitorForm({ ...visitorForm, visitDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsVisitorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Inviting..." : "Confirm Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule 1-to-1 Modal */}
      {isOneToOneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold text-foreground">Schedule 1-to-1 Synergy Session</h3>
              </div>
              <button
                onClick={() => setIsOneToOneOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleOneToOne} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Connect With Chapter Member *</label>
                <select
                  required
                  value={oneToOneForm.receiverId}
                  onChange={(e) => setOneToOneForm({ ...oneToOneForm, receiverId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Member</option>
                  {chapterMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.businessName} ({m.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={oneToOneForm.date}
                    onChange={(e) => setOneToOneForm({ ...oneToOneForm, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Duration (Minutes)</label>
                  <select
                    value={oneToOneForm.duration}
                    onChange={(e) => setOneToOneForm({ ...oneToOneForm, duration: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (Recommended)</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Location / Meeting Link</label>
                <input
                  type="text"
                  value={oneToOneForm.location}
                  onChange={(e) => setOneToOneForm({ ...oneToOneForm, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Synergy Topics / Goals</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Discuss cross-referrals between IT consulting and manufacturing..."
                  value={oneToOneForm.notes}
                  onChange={(e) => setOneToOneForm({ ...oneToOneForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOneToOneOpen(false)}
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
    </div>
  );
}
