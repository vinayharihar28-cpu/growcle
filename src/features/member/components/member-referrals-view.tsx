"use client";

import React, { useEffect, useState } from "react";
import {
  Handshake,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Search,
  IndianRupee,
  Building2,
  User,
  Users,
  Globe,
  Quote,
  Smartphone,
  BookUser,
} from "lucide-react";
import {
  getMemberContext,
  getMemberReferrals,
  giveMemberReferral,
  updateMemberReferralStatus,
  markReferralConvertedAndTYFCB,
  getAllChaptersForSelection,
  getChapterMembersForSelection,
  getChapterVisitorsForSelection,
  getChapterMemberDirectory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { ReferralStatus } from "@prisma/client";
import { useContactPicker, PickedContact } from "@/shared/hooks/use-contact-picker";
import { ContactPickerModal } from "@/shared/components/contact-picker-modal";

export function MemberReferralsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [referrals, setReferrals] = useState<{ given: any[]; received: any[] }>({
    given: [],
    received: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chapterMembers, setChapterMembers] = useState<any[]>([]);
  const [allChapters, setAllChapters] = useState<any[]>([]);

  // Pass Referral modal state
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<"LOCAL_MEMBER" | "CROSS_CHAPTER" | "VISITOR">("LOCAL_MEMBER");
  const [selectedCrossChapterId, setSelectedCrossChapterId] = useState<string>("");
  const [crossChapterMembers, setCrossChapterMembers] = useState<any[]>([]);
  const [chapterVisitors, setChapterVisitors] = useState<any[]>([]);
  const [loadingCrossMembers, setLoadingCrossMembers] = useState(false);

  const [giveForm, setGiveForm] = useState({
    toMemberId: "",
    referralName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: 0,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Contact Picker & Mobile View States
  const { isSupported: isContactPickerSupported, pickContact } = useContactPicker();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"GIVEN" | "RECEIVED">("GIVEN");

  // TYFCB Converted Modal State
  const [selectedReferralForTYFCB, setSelectedReferralForTYFCB] = useState<any | null>(null);
  const [tyfcbForm, setTyfcbForm] = useState({
    amount: 0,
    testimonialText: "",
  });
  const [submittingTYFCB, setSubmittingTYFCB] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const [res, members, chapters, visitors] = await Promise.all([
        getMemberReferrals(ctx.memberId),
        getChapterMemberDirectory(ctx.chapterId),
        getAllChaptersForSelection(),
        getChapterVisitorsForSelection(ctx.chapterId),
      ]);
      setReferrals(res);
      setChapterMembers(members.filter((m) => m.id !== ctx.memberId));
      setAllChapters(chapters);
      setChapterVisitors(visitors);
    } catch (err) {
      console.error("Failed to load referrals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When selecting a different chapter for cross-chapter referral
  const handleCrossChapterChange = async (chapterId: string) => {
    setSelectedCrossChapterId(chapterId);
    if (!chapterId) {
      setCrossChapterMembers([]);
      return;
    }
    setLoadingCrossMembers(true);
    try {
      const members = await getChapterMembersForSelection(chapterId);
      setCrossChapterMembers(members.filter((m) => m.id !== context?.memberId));
    } catch (e) {
      console.error("Failed to load cross-chapter members", e);
    } finally {
      setLoadingCrossMembers(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectContact = (contact: PickedContact) => {
    setGiveForm((prev) => ({
      ...prev,
      clientName: contact.name || prev.clientName,
      clientPhone: contact.phone || prev.clientPhone,
      clientEmail: contact.email || prev.clientEmail,
      referralName: prev.referralName || (contact.name ? `Referral for ${contact.name}` : ""),
    }));
  };

  const handleOpenContactPicker = async () => {
    if (isContactPickerSupported) {
      try {
        const contact = await pickContact();
        if (contact && (contact.name || contact.phone || contact.email)) {
          handleSelectContact(contact);
          return;
        }
      } catch (err) {
        console.warn("[ContactPicker] Picker closed or error:", err);
      }
    }
    // Fallback: Open directory search & smart paste card modal
    setIsContactModalOpen(true);
  };

  const handleGiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !giveForm.toMemberId || !giveForm.referralName) return;
    setSubmitting(true);
    try {
      const isCross = recipientType === "CROSS_CHAPTER";
      const isVisitor = recipientType === "VISITOR";

      await giveMemberReferral({
        fromMemberId: context.memberId,
        toMemberId: giveForm.toMemberId,
        chapterId: context.chapterId,
        crossChapterId: isCross ? selectedCrossChapterId : undefined,
        isVisitorReferral: isVisitor,
        referralName: giveForm.referralName,
        clientName: giveForm.clientName,
        clientEmail: giveForm.clientEmail,
        clientPhone: giveForm.clientPhone,
        value: Number(giveForm.value) || 0,
        notes: giveForm.notes,
      });

      setIsGiveOpen(false);
      setGiveForm({
        toMemberId: "",
        referralName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        value: 0,
        notes: "",
      });
      setRecipientType("LOCAL_MEMBER");
      setSelectedCrossChapterId("");
      await loadData();
    } catch (err) {
      console.error("Failed to pass referral", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenTYFCB = (ref: any) => {
    setSelectedReferralForTYFCB(ref);
    setTyfcbForm({
      amount: ref.value || 0,
      testimonialText: `Thank you to ${ref.partnerName} for connecting us. The business deal was successfully closed and we are extremely satisfied with their strategic collaboration!`,
    });
  };

  const handleTYFCBSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !selectedReferralForTYFCB) return;
    setSubmittingTYFCB(true);
    try {
      await markReferralConvertedAndTYFCB({
        referralId: selectedReferralForTYFCB.id,
        memberId: context.memberId,
        tyfcbAmount: Number(tyfcbForm.amount) || 0,
        testimonialText: tyfcbForm.testimonialText,
      });
      setSelectedReferralForTYFCB(null);
      await loadData();
    } catch (err) {
      console.error("Failed to mark referral as converted", err);
    } finally {
      setSubmittingTYFCB(false);
    }
  };

  const handleStatusUpdate = async (referralId: string, status: ReferralStatus) => {
    if (!context) return;
    try {
      await updateMemberReferralStatus(referralId, context.memberId, status);
      await loadData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filterReferral = (r: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.partnerName.toLowerCase().includes(q) ||
      r.clientName.toLowerCase().includes(q) ||
      (r.chapterName && r.chapterName.toLowerCase().includes(q))
    );
  };

  const filteredGiven = referrals.given.filter(filterReferral);
  const filteredReceived = referrals.received.filter(filterReferral);

  const getChapterBadgeClass = (themeColor: string) => {
    switch (themeColor) {
      case "blue":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "indigo":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "amber":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "rose":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Member Referrals Exchange</h2>
          <p className="text-sm text-muted-foreground">
            Pass client opportunities across your chapter, cross-chapter network, and chapter visitors.
          </p>
        </div>

        <button
          onClick={() => setIsGiveOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Pass Referral</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search opportunity title, colleague, or chapter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
        />
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex rounded-xl bg-muted/60 p-1 text-xs font-semibold">
        <button
          onClick={() => setMobileTab("GIVEN")}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === "GIVEN"
              ? "bg-background text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
          Given ({referrals.given.length})
        </button>
        <button
          onClick={() => setMobileTab("RECEIVED")}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === "RECEIVED"
              ? "bg-background text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
          Received ({referrals.received.length})
        </button>
      </div>

      {/* Two Separate Columns: Given & Received */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading referrals exchange...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* COLUMN 1: GIVEN REFERRALS */}
          <div className={`space-y-4 ${mobileTab === "GIVEN" ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border shadow-xs">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Given Referrals</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {referrals.given.length} Passed
              </span>
            </div>

            {filteredGiven.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground space-y-2">
                <p>No given referrals logged yet.</p>
                <button
                  onClick={() => setIsGiveOpen(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  Pass your first referral →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGiven.map((r) => {
                  const isVisitor = r.isVisitorReferral;
                  const isCross = r.isCrossChapter;

                  return (
                    <div
                      key={r.id}
                      className={`p-4 rounded-xl border shadow-xs transition-all flex flex-col justify-between space-y-3 ${
                        isVisitor
                          ? "border-purple-500/40 bg-purple-500/[0.03]"
                          : isCross
                          ? "border-primary/40 bg-primary/[0.02]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground">{r.title}</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              r.status === "CLOSED_WON"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : r.status === "CLOSED_LOST"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {r.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Badges for Visitor or Cross-Chapter */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isVisitor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              <Users className="h-3 w-3" /> Visitor Referral
                            </span>
                          )}
                          {isCross && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getChapterBadgeClass(
                                r.chapterThemeColor
                              )}`}
                            >
                              <Globe className="h-3 w-3" /> Cross-Chapter: {r.chapterName}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            Passed to: <strong className="text-foreground">{r.partnerName}</strong> ({r.partnerBusiness})
                          </div>
                          <div>
                            Client: <span className="text-foreground font-medium">{r.clientName}</span>
                            {r.clientPhone && ` • ${r.clientPhone}`}
                          </div>
                          {r.notes && <p className="text-[11px] italic text-muted-foreground pt-1">&ldquo;{r.notes}&rdquo;</p>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                        <span className="font-bold text-foreground">
                          {r.value > 0 ? formatINR(r.value) : "Value Unspecified"}
                        </span>
                        <span className="text-muted-foreground">{r.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMN 2: RECEIVED REFERRALS */}
          <div className={`space-y-4 ${mobileTab === "RECEIVED" ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border shadow-xs">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                <h3 className="font-bold text-sm text-foreground">Received Referrals</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {referrals.received.length} Received
              </span>
            </div>

            {filteredReceived.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
                No received referrals logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReceived.map((r) => {
                  const isVisitor = r.isVisitorReferral;
                  const isCross = r.isCrossChapter;
                  const isWon = r.status === "CLOSED_WON";

                  return (
                    <div
                      key={r.id}
                      className={`p-4 rounded-xl border shadow-xs transition-all flex flex-col justify-between space-y-3 ${
                        isVisitor
                          ? "border-purple-500/40 bg-purple-500/[0.03]"
                          : isCross
                          ? "border-primary/40 bg-primary/[0.02]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground">{r.title}</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isWon
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : r.status === "CLOSED_LOST"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {r.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Badges for Visitor or Cross-Chapter */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isVisitor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              <Users className="h-3 w-3" /> Visitor Referral
                            </span>
                          )}
                          {isCross && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getChapterBadgeClass(
                                r.chapterThemeColor
                              )}`}
                            >
                              <Globe className="h-3 w-3" /> Cross-Chapter: {r.chapterName}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            Referred by: <strong className="text-foreground">{r.partnerName}</strong> ({r.partnerBusiness})
                          </div>
                          <div>
                            Client Lead: <span className="text-foreground font-medium">{r.clientName}</span>
                            {r.clientPhone && ` • ${r.clientPhone}`}
                          </div>
                          {r.notes && <p className="text-[11px] italic text-muted-foreground pt-1">&ldquo;{r.notes}&rdquo;</p>}
                        </div>
                      </div>

                      {/* Action Bar for Received Referrals (TYFCB Conversion & Status) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-xs">
                        <div>
                          <span className="font-bold text-foreground">
                            {r.value > 0 ? formatINR(r.value) : "—"}
                          </span>
                          {r.tyfcbAmount > 0 && (
                            <span className="ml-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              (TYFCB: {formatINR(r.tyfcbAmount)})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!isWon ? (
                            <button
                              onClick={() => handleOpenTYFCB(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Convert (TYFCB)</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Business Closed
                            </span>
                          )}

                          <select
                            value={r.status}
                            onChange={(e) => handleStatusUpdate(r.id, e.target.value as any)}
                            className="px-2 py-1 rounded-md bg-muted border border-border text-xs text-foreground focus:outline-none"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="CLOSED_WON">Closed Won</option>
                            <option value="CLOSED_LOST">Closed Lost</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Give Referral Modal (Cross-Chapter & Visitor enabled) */}
      {isGiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Pass Business Referral</h3>
              </div>
              <button
                onClick={() => setIsGiveOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGiveSubmit} className="space-y-4">
              {/* Recipient Network Selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Select Recipient Network *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType("LOCAL_MEMBER")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      recipientType === "LOCAL_MEMBER"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    My Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType("CROSS_CHAPTER")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      recipientType === "CROSS_CHAPTER"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    Cross-Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType("VISITOR")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      recipientType === "VISITOR"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    Chapter Visitor
                  </button>
                </div>
              </div>

              {/* Cross-Chapter Chapter Selector */}
              {recipientType === "CROSS_CHAPTER" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Select Target Chapter *</label>
                  <select
                    required
                    value={selectedCrossChapterId}
                    onChange={(e) => handleCrossChapterChange(e.target.value)}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                  >
                    <option value="">Choose Target Chapter...</option>
                    {allChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.chapterCode || "Chapter"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient Member / Visitor Selection */}
              <div>
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <span>
                    {recipientType === "VISITOR"
                      ? "Select Chapter Visitor"
                      : recipientType === "CROSS_CHAPTER"
                      ? "Select Cross-Chapter Member"
                      : "Select Chapter Member"}
                  </span>
                  <span className="text-rose-500">*</span>
                </label>

                {recipientType === "VISITOR" ? (
                  <select
                    required
                    value={giveForm.toMemberId}
                    onChange={(e) => setGiveForm({ ...giveForm, toMemberId: e.target.value })}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                  >
                    <option value="">Select Visitor...</option>
                    {chapterVisitors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} • {v.businessName || "Visitor"} ({v.industry || "General"})
                      </option>
                    ))}
                    {chapterMembers.length > 0 && (
                      <option value={chapterMembers[0].id}>Assign to Chapter Sponsor ({chapterMembers[0].name})</option>
                    )}
                  </select>
                ) : recipientType === "CROSS_CHAPTER" ? (
                  <select
                    required
                    disabled={!selectedCrossChapterId || loadingCrossMembers}
                    value={giveForm.toMemberId}
                    onChange={(e) => setGiveForm({ ...giveForm, toMemberId: e.target.value })}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">
                      {loadingCrossMembers ? "Loading chapter roster..." : "Select Cross-Chapter Member..."}
                    </option>
                    {crossChapterMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} • {m.businessName || "Member"} ({m.industry || "General"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    required
                    value={giveForm.toMemberId}
                    onChange={(e) => setGiveForm({ ...giveForm, toMemberId: e.target.value })}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                  >
                    <option value="">Select Chapter Colleague...</option>
                    {chapterMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} • {m.businessName || "Member"} ({m.industry || "General"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Referral Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ERP Implementation for Logistics Client"
                  value={giveForm.referralName}
                  onChange={(e) => setGiveForm({ ...giveForm, referralName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Contact Picker Trigger Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <BookUser className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Select Client Contact</p>
                    <p className="text-[11px] text-muted-foreground">Pick from phonebook or directory to auto-fill</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenContactPicker}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs cursor-pointer shrink-0"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Choose Contact</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Name / Business *</label>
                  <input
                    type="text"
                    required
                    placeholder="Company or Contact Name"
                    value={giveForm.clientName}
                    onChange={(e) => setGiveForm({ ...giveForm, clientName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estimated Deal Size (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={giveForm.value || ""}
                    onChange={(e) => setGiveForm({ ...giveForm, value: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={giveForm.clientPhone}
                    onChange={(e) => setGiveForm({ ...giveForm, clientPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Email</label>
                  <input
                    type="email"
                    placeholder="decisionmaker@company.com"
                    value={giveForm.clientEmail}
                    onChange={(e) => setGiveForm({ ...giveForm, clientEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Introductory Notes & Synergy</label>
                <textarea
                  rows={2}
                  value={giveForm.notes}
                  onChange={(e) => setGiveForm({ ...giveForm, notes: e.target.value })}
                  placeholder="Context about the client's problem, urgency, and expected solution..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsGiveOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Passing Referral..." : "Pass Referral Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TYFCB (Thank You For Closed Business) Modal */}
      {selectedReferralForTYFCB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Mark Converted & Record TYFCB</h3>
              </div>
              <button
                onClick={() => setSelectedReferralForTYFCB(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTYFCBSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                <div className="text-muted-foreground">
                  Referral: <strong className="text-foreground">{selectedReferralForTYFCB.title}</strong>
                </div>
                <div className="text-muted-foreground">
                  Referred By: <strong className="text-foreground">{selectedReferralForTYFCB.partnerName}</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Total Closed Business Value (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 75000"
                  value={tyfcbForm.amount || ""}
                  onChange={(e) => setTyfcbForm({ ...tyfcbForm, amount: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Quote className="h-3.5 w-3.5 text-primary" />
                  <span>Testimonial for {selectedReferralForTYFCB.partnerName}</span>
                </label>
                <textarea
                  rows={3}
                  value={tyfcbForm.testimonialText}
                  onChange={(e) => setTyfcbForm({ ...tyfcbForm, testimonialText: e.target.value })}
                  placeholder="Mention how this member facilitated the business, their reliability, and praise for their support..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  This testimonial will be featured on their member profile and homepage showcase.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedReferralForTYFCB(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTYFCB}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submittingTYFCB ? "Saving Converted Deal..." : "Confirm & Record TYFCB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Picker Modal Fallback & Chapter Directory Picker */}
      <ContactPickerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSelectContact={handleSelectContact}
        directoryContacts={chapterMembers}
        title="Select Referral Contact"
        description="Choose a contact from your chapter directory, paste raw contact info, or use your phonebook."
      />
    </div>
  );
}
