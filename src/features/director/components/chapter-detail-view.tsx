"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  ClipboardCheck,
  Handshake,
  CreditCard,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ExternalLink,
  ShieldCheck,
  IndianRupee,
  FileEdit,
  Settings,
  Save,
  CheckCircle,
  Power,
} from "lucide-react";
import { getDirectorChapterDetail, updateChapterDetails } from "../actions/director-actions";
import { AssignLeadershipModal } from "./assign-leadership-modal";
import { MemberRoleModal } from "./member-role-modal";
import { ConvertVisitorModal } from "./convert-visitor-modal";
import { EditChapterModal } from "./edit-chapter-modal";
import Link from "next/link";

interface ChapterDetailViewProps {
  chapterId: string;
}

export function ChapterDetailView({ chapterId }: ChapterDetailViewProps) {
  const [detail, setDetail] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "leadership" | "meetings" | "visitors" | "referrals" | "payments" | "settings"
  >("overview");
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    chapterCode: "",
    region: "",
    location: "",
    meetingDay: "Wednesday",
    meetingTime: "07:30 AM",
    meetingFee: 800,
    upiId: "",
    upiName: "",
    themeColor: "emerald",
    description: "",
    isActive: true,
  });

  // Modals state
  const [leadershipModal, setLeadershipModal] = useState<{
    isOpen: boolean;
    position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  }>({ isOpen: false, position: "PRESIDENT" });

  const [roleModal, setRoleModal] = useState<{
    isOpen: boolean;
    member: any | null;
  }>({ isOpen: false, member: null });

  const [visitorModal, setVisitorModal] = useState<{
    isOpen: boolean;
    visitor: any | null;
  }>({ isOpen: false, visitor: null });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDirectorChapterDetail(chapterId);
      setDetail(data);
      if (data) {
        setSettingsForm({
          name: data.name || "",
          chapterCode: data.chapterCode || "",
          region: data.region || "",
          location: data.location || "",
          meetingDay: data.meetingDay || "Wednesday",
          meetingTime: data.meetingTime || "07:30 AM",
          meetingFee: data.meetingFee ?? 800,
          upiId: data.upiId || "",
          upiName: data.upiName || "",
          themeColor: data.themeColor || "emerald",
          description: data.description || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      }
    } catch (err) {
      console.error("Failed to load chapter detail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [chapterId]);

  if (loading) {
    return <div className="h-96 rounded-xl bg-muted animate-pulse" />;
  }

  if (!detail) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-bold">Chapter Not Found</h3>
        <p className="text-sm text-muted-foreground">The requested chapter is not under your assigned scope or has been moved.</p>
        <Link href="/dashboard/director/chapters" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-semibold">
          Return to Chapters List
        </Link>
      </div>
    );
  }

  const availableMembers = detail.members.map((m: any) => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    email: m.email,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Director Scope</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                detail.status === "HEALTHY"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {detail.status === "HEALTHY" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {detail.status === "HEALTHY" ? "Fully Staffed" : `${detail.vacancies} Leadership Vacancy`}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mt-1">{detail.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> Code: {detail.chapterCode}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {detail.location} ({detail.region})</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {detail.meetingDay}s @ {detail.meetingTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileEdit className="h-3.5 w-3.5 text-primary" /> Edit Chapter
          </button>
          <button
            onClick={() => setLeadershipModal({ isOpen: true, position: "PRESIDENT" })}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5" /> Assign Leadership
          </button>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="flex border-b overflow-x-auto space-x-4">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "members", label: `Members (${detail.members.length})`, icon: Users },
          { id: "leadership", label: "Leadership Team", icon: UserCheck },
          { id: "meetings", label: `Meetings (${detail.meetings.length})`, icon: Calendar },
          { id: "visitors", label: `Visitors (${detail.visitors.length})`, icon: UserPlus },
          { id: "referrals", label: `Referrals (${detail.referrals.length})`, icon: Handshake },
          { id: "payments", label: `Payments (${detail.payments.length})`, icon: CreditCard },
          { id: "settings", label: "Settings & Details", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 pt-2 text-sm font-medium border-b-2 transition-all shrink-0 ${
                isActive
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-bold text-base text-foreground">Chapter Metrics Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Active Members</span>
                <p className="text-xl font-bold text-foreground mt-1">{detail.memberCount}</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Attendance Rate</span>
                <p className="text-xl font-bold text-foreground mt-1">{detail.attendanceRate}%</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Visitor Conversion</span>
                <p className="text-xl font-bold text-foreground mt-1">{detail.visitorConversion}%</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Closed Business</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">₹{detail.closedBusiness.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="pt-2 border-t space-y-2">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Weekly Schedule & Venue</h4>
              <p className="text-sm font-medium">{detail.meetingDay}s at {detail.meetingTime} • {detail.location}</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Leadership Officers</h3>
              {detail.vacancies > 0 && (
                <span className="text-xs text-amber-600 font-semibold">{detail.vacancies} Vacant</span>
              )}
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">President:</span>
                {detail.president ? (
                  <span className="font-semibold text-foreground">{detail.president.name}</span>
                ) : (
                  <button
                    onClick={() => setLeadershipModal({ isOpen: true, position: "PRESIDENT" })}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Plus className="h-3 w-3" /> Assign President
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Vice President:</span>
                {detail.vicePresident ? (
                  <span className="font-semibold text-foreground">{detail.vicePresident.name}</span>
                ) : (
                  <button
                    onClick={() => setLeadershipModal({ isOpen: true, position: "VICE_PRESIDENT" })}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Plus className="h-3 w-3" /> Assign VP
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Treasurer:</span>
                {detail.treasurer ? (
                  <span className="font-semibold text-foreground">{detail.treasurer.name}</span>
                ) : (
                  <button
                    onClick={() => setLeadershipModal({ isOpen: true, position: "TREASURER" })}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Plus className="h-3 w-3" /> Assign Treasurer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members */}
      {activeTab === "members" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Members Roster ({detail.members.length})</h3>
            <Link
              href="/dashboard/director/members"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              Full Member Directory <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Business / Industry</th>
                  <th className="px-4 py-3">Current Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {detail.members.map((m: any) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{m.firstName} {m.lastName}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.businessName} • {m.industry}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        m.currentRole !== "MEMBER" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {m.currentRole}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setRoleModal({
                          isOpen: true,
                          member: {
                            id: m.id,
                            name: `${m.firstName} ${m.lastName}`,
                            email: m.email,
                            chapterId: detail.id,
                            chapterName: detail.name,
                            currentRole: m.currentRole,
                          },
                        })}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Leadership */}
      {activeTab === "leadership" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "President", pos: "PRESIDENT" as const, data: detail.president },
            { title: "Vice President", pos: "VICE_PRESIDENT" as const, data: detail.vicePresident },
            { title: "Treasurer", pos: "TREASURER" as const, data: detail.treasurer },
          ].map((item) => (
            <div key={item.pos} className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  item.data ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                  {item.data ? "Active" : "Unassigned"}
                </span>
              </div>
              {item.data ? (
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-foreground">{item.data.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.data.email}</p>
                  {item.data.businessName && (
                    <p className="text-xs text-primary font-medium">{item.data.businessName}</p>
                  )}
                  <div className="pt-3">
                    <button
                      onClick={() => setLeadershipModal({ isOpen: true, position: item.pos })}
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                    >
                      Replace {item.title}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <p className="text-xs text-muted-foreground">Position is currently vacant for this chapter.</p>
                  <button
                    onClick={() => setLeadershipModal({ isOpen: true, position: item.pos })}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Assign {item.title}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Meetings */}
      {activeTab === "meetings" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Scheduled Chapter Meetings ({detail.meetings.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detail.meetings.map((m: any) => (
              <div key={m.id} className="rounded-lg border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{m.title}</h4>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{m.status}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(m.date).toLocaleDateString()}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {m.location}</p>
                  <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> {m.attendanceCount} Attendees</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Visitors */}
      {activeTab === "visitors" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Chapter Visitors & Guest Pipeline ({detail.visitors.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Visitor Name</th>
                  <th className="px-4 py-3">Company & Industry</th>
                  <th className="px-4 py-3">Invited By</th>
                  <th className="px-4 py-3">Visit Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {detail.visitors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{v.company} • {v.industry}</td>
                    <td className="px-4 py-3 text-xs font-medium">{v.invitedBy}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(v.visitDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        v.status === "CONVERTED" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.status !== "CONVERTED" && (
                        <button
                          onClick={() => setVisitorModal({
                            isOpen: true,
                            visitor: {
                              id: v.id,
                              name: v.name,
                              email: v.email,
                              company: v.company,
                              chapterId: detail.id,
                              chapterName: detail.name,
                            },
                          })}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Convert to Member
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Referrals */}
      {activeTab === "referrals" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Referrals & Closed Business ({detail.referrals.length})</h3>
            <span className="text-xs font-bold text-emerald-600">Total Closed: ₹{detail.closedBusiness.toLocaleString("en-IN")}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Referral Title</th>
                  <th className="px-4 py-3">From Member</th>
                  <th className="px-4 py-3">To Member</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {detail.referrals.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{r.title}</td>
                    <td className="px-4 py-3 text-xs font-medium">{r.fromMemberName}</td>
                    <td className="px-4 py-3 text-xs font-medium">{r.toMemberName}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">₹{r.value.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.status === "CLOSED_WON" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Payments */}
      {activeTab === "payments" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Chapter Membership Dues & Ledger ({detail.payments.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Invoice Ref</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {detail.payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{p.memberName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.reference}</td>
                    <td className="px-4 py-3 font-bold text-foreground">₹{p.amount.toLocaleString("en-IN")} {p.currency}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === "SUCCEEDED" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Settings & Details */}
      {activeTab === "settings" && (
        <div className="max-w-4xl border rounded-2xl bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Chapter Settings & Configuration</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage identity, meeting schedule, venue location, standard fees, UPI credentials, and branding colors.
              </p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shrink-0"
            >
              <FileEdit className="h-3.5 w-3.5" /> Open Edit Modal
            </button>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Chapter settings and details updated successfully!
            </div>
          )}

          {settingsError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {settingsError}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSavingSettings(true);
              setSettingsSaved(false);
              setSettingsError(null);
              try {
                await updateChapterDetails({
                  chapterId: detail.id,
                  name: settingsForm.name,
                  chapterCode: settingsForm.chapterCode,
                  region: settingsForm.region,
                  meetingLocation: settingsForm.location,
                  meetingDay: settingsForm.meetingDay,
                  meetingTime: settingsForm.meetingTime,
                  meetingFee: Number(settingsForm.meetingFee),
                  upiId: settingsForm.upiId,
                  upiName: settingsForm.upiName,
                  themeColor: settingsForm.themeColor,
                  description: settingsForm.description,
                  isActive: settingsForm.isActive,
                });
                await loadData();
                setSettingsSaved(true);
                setTimeout(() => setSettingsSaved(false), 4000);
              } catch (err: any) {
                setSettingsError(err?.message || "Failed to update chapter settings.");
              } finally {
                setSavingSettings(false);
              }
            }}
            className="space-y-6"
          >
            {/* Identity & Code */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identity & Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Chapter Code</label>
                  <input
                    type="text"
                    value={settingsForm.chapterCode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, chapterCode: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Region / Territory</label>
                  <input
                    type="text"
                    value={settingsForm.region}
                    onChange={(e) => setSettingsForm({ ...settingsForm, region: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Venue / Location</label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description / Notes</label>
                <textarea
                  rows={2}
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                  className="w-full p-2.5 text-sm border rounded-xl bg-background"
                />
              </div>
            </div>

            {/* Meeting Schedule & Fees */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Schedule & Fees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Regular Meeting Day</label>
                  <select
                    value={settingsForm.meetingDay}
                    onChange={(e) => setSettingsForm({ ...settingsForm, meetingDay: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Time</label>
                  <input
                    type="text"
                    value={settingsForm.meetingTime}
                    onChange={(e) => setSettingsForm({ ...settingsForm, meetingTime: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.meetingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, meetingFee: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
              </div>
            </div>

            {/* UPI & Treasury */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chapter UPI Collection</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">UPI VPA ID</label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Payee Name</label>
                  <input
                    type="text"
                    value={settingsForm.upiName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiName: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-xl bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Theme & Status */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Branding & Status</h4>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500" },
                  { id: "indigo", label: "Indigo Royal", bg: "bg-indigo-500" },
                  { id: "purple", label: "Purple Velvet", bg: "bg-purple-500" },
                  { id: "amber", label: "Amber Gold", bg: "bg-amber-500" },
                  { id: "rose", label: "Rose Crimson", bg: "bg-rose-500" },
                  { id: "cyan", label: "Cyan Ocean", bg: "bg-cyan-500" },
                  { id: "orange", label: "Sunset Orange", bg: "bg-orange-500" },
                ].map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, themeColor: color.id })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      settingsForm.themeColor === color.id
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5 font-bold"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                    {color.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/20">
                <div>
                  <h5 className="text-xs font-bold text-foreground">Operating Status</h5>
                  <p className="text-[11px] text-muted-foreground">
                    {settingsForm.isActive ? "Chapter is currently active and accepting meetings." : "Chapter is inactive."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, isActive: !settingsForm.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    settingsForm.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
                >
                  {settingsForm.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={savingSettings}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingSettings ? "Saving Changes..." : "Save Chapter Settings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      <EditChapterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        chapter={detail}
        onSuccess={loadData}
      />

      <AssignLeadershipModal
        isOpen={leadershipModal.isOpen}
        onClose={() => setLeadershipModal((prev) => ({ ...prev, isOpen: false }))}
        chapterId={detail.id}
        chapterName={detail.name}
        initialPosition={leadershipModal.position}
        availableMembers={availableMembers}
        onSuccess={loadData}
      />

      <MemberRoleModal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal({ isOpen: false, member: null })}
        member={roleModal.member}
        onSuccess={loadData}
      />

      <ConvertVisitorModal
        isOpen={visitorModal.isOpen}
        onClose={() => setVisitorModal({ isOpen: false, visitor: null })}
        visitor={visitorModal.visitor}
        onSuccess={loadData}
      />
    </div>
  );
}
