"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Handshake,
  MessagesSquare,
  Target,
  ThumbsDown,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  getMemberContext,
  getChapterMemberDetail,
  giveMemberReferral,
  scheduleMemberOneToOne,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

interface MemberDetailViewProps {
  memberId: string;
}

export function MemberDetailView({ memberId }: MemberDetailViewProps) {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralForm, setReferralForm] = useState({
    referralName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: 0,
    notes: "",
  });

  const [isOneToOneOpen, setIsOneToOneOpen] = useState(false);
  const [oneToOneForm, setOneToOneForm] = useState({
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    duration: 60,
    location: "Executive Lounge / Virtual Meeting",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ctx, detail] = await Promise.all([
        getMemberContext(),
        getChapterMemberDetail(memberId),
      ]);
      setContext(ctx);
      setMember(detail);
    } catch (err: any) {
      console.error("Failed to load member details", err);
      setError(err?.message || "Failed to load member details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [memberId]);

  const handleGiveReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !member || !referralForm.referralName) return;
    setSubmitting(true);
    try {
      await giveMemberReferral({
        fromMemberId: context.memberId,
        toMemberId: member.id,
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
        referralName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        value: 0,
        notes: "",
      });
      setToastMessage(`Referral passed successfully to ${member.name}!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Failed to pass referral", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleOneToOneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !member || !oneToOneForm.date) return;
    setSubmitting(true);
    try {
      await scheduleMemberOneToOne({
        initiatorId: context.memberId,
        receiverId: member.id,
        date: new Date(oneToOneForm.date),
        duration: Number(oneToOneForm.duration) || 60,
        location: oneToOneForm.location,
        notes: oneToOneForm.notes,
      });
      setIsOneToOneOpen(false);
      setOneToOneForm({
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        duration: 60,
        location: "Executive Lounge / Virtual Meeting",
        notes: "",
      });
      setToastMessage(`1-to-1 synergy scheduled with ${member.name}!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Failed to schedule 1-to-1", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/member/members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chapter Directory</span>
        </Link>

        {toastMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading chapter colleague profile...
        </div>
      ) : error || !member ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
          <p className="text-foreground font-semibold">Member profile not accessible</p>
          <p className="text-xs text-muted-foreground">{error || "The requested chapter member record does not exist."}</p>
          <Link
            href="/dashboard/member/members"
            className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
          >
            ← Return to directory
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Member Profile Overview Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                  {member.profileImage ? (
                    <img src={member.profileImage} alt={member.name} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{member.name}</h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {member.roleName}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Active Chapter Colleague
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{member.business.businessName}</span>
                    <span className="text-muted-foreground font-normal">• {member.business.industry}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chapter: <strong className="text-foreground">{member.chapterName}</strong> ({member.membershipNumber}) • Joined {member.joinedAt}
                  </p>
                </div>
              </div>

              {/* Direct Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsReferralOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Handshake className="h-4 w-4" />
                  <span>Give Referral</span>
                </button>

                <button
                  onClick={() => setIsOneToOneOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs hover:bg-muted/80 transition-colors"
                >
                  <MessagesSquare className="h-4 w-4 text-blue-500" />
                  <span>Schedule 1-to-1</span>
                </button>
              </div>
            </div>

            {/* Contact & Links Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">{member.email}</span>
              </a>
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>{member.phone}</span>
              </a>
              {member.website ? (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="truncate">Official Website</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                </a>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span className="truncate">{member.business.businessAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Content Full Width */}
          <div className="space-y-6">
            {/* Business Overview */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Business Overview & Capabilities</h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Services & Deliverables
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {member.business.description}
                </p>
              </div>

              {member.bio && (
                <div className="space-y-1 pt-3 border-t border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Professional Background
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              )}
            </div>

            {/* What I Do & Who I Help */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">What I Do</span>
                <p className="text-xs text-foreground leading-relaxed">
                  {member.business.whatIDo}
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2">
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Who I Help</span>
                <p className="text-xs text-foreground leading-relaxed">
                  {member.business.whoIHelp}
                </p>
              </div>
            </div>
          </div>

          {/* Give Referral Modal */}
          {isReferralOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Give Referral to {member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.business.businessName} ({member.business.industry})</p>
                  </div>
                  <button
                    onClick={() => setIsReferralOpen(false)}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleGiveReferralSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Referral Opportunity Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Client Consultation"
                      value={referralForm.referralName}
                      onChange={(e) => setReferralForm({ ...referralForm, referralName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Client Name / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Industries"
                        value={referralForm.clientName}
                        onChange={(e) => setReferralForm({ ...referralForm, clientName: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Estimated Value (₹ INR)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="50000"
                        value={referralForm.value || ""}
                        onChange={(e) => setReferralForm({ ...referralForm, value: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Client Contact Email</label>
                      <input
                        type="email"
                        placeholder="client@company.com"
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
                    <label className="text-xs font-medium text-muted-foreground">Opportunity Details & Background Notes</label>
                    <textarea
                      rows={3}
                      value={referralForm.notes}
                      onChange={(e) => setReferralForm({ ...referralForm, notes: e.target.value })}
                      placeholder="Explain client requirements, budget expectation, or intro instructions..."
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReferralOpen(false)}
                      className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Pass Referral (₹)"}
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
                    <h3 className="text-lg font-bold text-foreground">Schedule 1-to-1 with {member.name}</h3>
                  </div>
                  <button
                    onClick={() => setIsOneToOneOpen(false)}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleScheduleOneToOneSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Proposed Date *</label>
                      <input
                        type="date"
                        required
                        value={oneToOneForm.date}
                        onChange={(e) => setOneToOneForm({ ...oneToOneForm, date: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Duration</label>
                      <select
                        value={oneToOneForm.duration}
                        onChange={(e) => setOneToOneForm({ ...oneToOneForm, duration: Number(e.target.value) })}
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
                    <label className="text-xs font-medium text-muted-foreground">Location / Meeting Medium</label>
                    <input
                      type="text"
                      placeholder="e.g. Chapter Meeting Hall / Zoom Link"
                      value={oneToOneForm.location}
                      onChange={(e) => setOneToOneForm({ ...oneToOneForm, location: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Synergy Topics / Goals</label>
                    <textarea
                      rows={3}
                      value={oneToOneForm.notes}
                      onChange={(e) => setOneToOneForm({ ...oneToOneForm, notes: e.target.value })}
                      placeholder="What opportunities or client profiles would you like to explore together?"
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOneToOneOpen(false)}
                      className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Scheduling..." : "Confirm 1-to-1 Session"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
