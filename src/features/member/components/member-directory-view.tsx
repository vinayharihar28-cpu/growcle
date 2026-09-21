"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Building2,
  Mail,
  Phone,
  Handshake,
  MessagesSquare,
  ArrowRight,
  Filter,
  CheckCircle2,
  Target,
  ExternalLink,
} from "lucide-react";
import {
  getMemberContext,
  getChapterMemberDirectory,
  giveMemberReferral,
  scheduleMemberOneToOne,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberDirectoryView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Selected member for direct actions
  const [referralTarget, setReferralTarget] = useState<any | null>(null);
  const [referralForm, setReferralForm] = useState({
    referralName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: 0,
    notes: "",
  });

  const [oneToOneTarget, setOneToOneTarget] = useState<any | null>(null);
  const [oneToOneForm, setOneToOneForm] = useState({
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    duration: 60,
    location: "Executive Lounge / Virtual Meeting",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const data = await getChapterMemberDirectory(ctx.chapterId, search, industryFilter);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load directory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, industryFilter]);

  const industries = Array.from(new Set(members.map((m) => m.industry).filter(Boolean)));

  const handleGiveReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !referralTarget || !referralForm.referralName) return;
    setSubmitting(true);
    try {
      await giveMemberReferral({
        fromMemberId: context.memberId,
        toMemberId: referralTarget.id,
        chapterId: context.chapterId,
        referralName: referralForm.referralName,
        clientName: referralForm.clientName,
        clientEmail: referralForm.clientEmail,
        clientPhone: referralForm.clientPhone,
        value: Number(referralForm.value) || 0,
        notes: referralForm.notes,
      });
      setReferralTarget(null);
      setReferralForm({
        referralName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        value: 0,
        notes: "",
      });
      setSuccessToast(`Referral passed successfully to ${referralTarget.name}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error("Failed to pass referral", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleOneToOneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !oneToOneTarget || !oneToOneForm.date) return;
    setSubmitting(true);
    try {
      await scheduleMemberOneToOne({
        initiatorId: context.memberId,
        receiverId: oneToOneTarget.id,
        date: new Date(oneToOneForm.date),
        duration: Number(oneToOneForm.duration) || 60,
        location: oneToOneForm.location,
        notes: oneToOneForm.notes,
      });
      setOneToOneTarget(null);
      setOneToOneForm({
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        duration: 60,
        location: "Executive Lounge / Virtual Meeting",
        notes: "",
      });
      setSuccessToast(`1-to-1 synergy scheduled with ${oneToOneTarget.name}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error("Failed to schedule 1-to-1", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Chapter Member Directory</h2>
          <p className="text-sm text-muted-foreground">
            Discover peer businesses, review competencies, and pass direct referral opportunities.
          </p>
        </div>

        {successToast && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by member name, company, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Industry Sectors</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading chapter directory...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No chapter members found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                      {m.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">{m.name}</h3>
                      <p className="text-xs text-muted-foreground">{m.roleName}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {m.industry}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{m.businessName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {m.companyDescription}
                  </p>
                  {m.bestReferral && (
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-foreground">
                      <Target className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1"><strong className="text-emerald-600 dark:text-emerald-400">Target:</strong> {m.bestReferral}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{m.phone}</span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/member/members/${m.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  <span>View Full Profile & Synergy Prompts</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Direct Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setReferralTarget(m)}
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Handshake className="h-3.5 w-3.5" />
                  <span>Give Referral</span>
                </button>

                <button
                  onClick={() => setOneToOneTarget(m)}
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <MessagesSquare className="h-3.5 w-3.5 text-blue-500" />
                  <span>1-to-1 Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Give Referral Modal */}
      {referralTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Give Referral to {referralTarget.name}</h3>
                <p className="text-xs text-muted-foreground">{referralTarget.businessName} ({referralTarget.industry})</p>
              </div>
              <button
                onClick={() => setReferralTarget(null)}
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
                  placeholder="e.g. Warehouse Automation Software Tender"
                  value={referralForm.referralName}
                  onChange={(e) => setReferralForm({ ...referralForm, referralName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Name / Business</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industries"
                    value={referralForm.clientName}
                    onChange={(e) => setReferralForm({ ...referralForm, clientName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estimated Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="75000"
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
                    placeholder="client@apex.com"
                    value={referralForm.clientEmail}
                    onChange={(e) => setReferralForm({ ...referralForm, clientEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Phone</label>
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
                  rows={2}
                  placeholder="Notes on client requirements..."
                  value={referralForm.notes}
                  onChange={(e) => setReferralForm({ ...referralForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setReferralTarget(null)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Passing..." : "Confirm Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule 1-to-1 Modal */}
      {oneToOneTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Schedule 1-to-1 with {oneToOneTarget.name}</h3>
                <p className="text-xs text-muted-foreground">{oneToOneTarget.businessName}</p>
              </div>
              <button
                onClick={() => setOneToOneTarget(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleOneToOneSubmit} className="space-y-4">
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
                <label className="text-xs font-medium text-muted-foreground">Meeting Venue / Video Link</label>
                <input
                  type="text"
                  value={oneToOneForm.location}
                  onChange={(e) => setOneToOneForm({ ...oneToOneForm, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Agenda & Discussion Topics</label>
                <textarea
                  rows={2}
                  placeholder="Cross-synergy exploration, target clients..."
                  value={oneToOneForm.notes}
                  onChange={(e) => setOneToOneForm({ ...oneToOneForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setOneToOneTarget(null)}
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
