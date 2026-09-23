"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserPlus,
  RefreshCw,
  Edit3,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipMembers,
  addLeadershipMember,
  updateLeadershipMember,
  getLeadershipVisitors,
  addLeadershipVisitor,
  updateMemberStatus,
  convertLeadershipVisitor,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { MemberStatus } from "@prisma/client";

export function LeadershipMembersView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'members' vs 'visitors'
  const [activeTab, setActiveTab] = useState<"members" | "visitors">("members");

  // Group by Date Toggle
  const [groupByDate, setGroupByDate] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // Add Member Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    industry: "",
    membershipNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Add Visitor Modal
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    invitedByMemberId: "",
  });
  const [visitorSubmitting, setVisitorSubmitting] = useState(false);

  // Edit Member Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    industry: string;
    roleName: string;
    status: MemberStatus;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    industry: "",
    roleName: "MEMBER",
    status: MemberStatus.ACTIVE,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleOpenEdit = (member: any) => {
    const nameParts = (member.name || "").split(" ");
    const fName = member.firstName || nameParts[0] || "";
    const lName = member.lastName || nameParts.slice(1).join(" ") || "";
    setEditingMemberId(member.id);
    setEditForm({
      firstName: fName,
      lastName: lName,
      email: member.email || "",
      phone: member.phone || "",
      businessName: member.businessName || "",
      industry: member.industry || "",
      roleName: member.currentRole || "MEMBER",
      status: member.status || MemberStatus.ACTIVE,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemberId || !editForm.firstName || !editForm.email) return;
    setEditSubmitting(true);
    try {
      await updateLeadershipMember({
        memberId: editingMemberId,
        ...editForm,
      });
      setIsEditOpen(false);
      setEditingMemberId(null);
      loadData();
    } catch (err) {
      console.error("Failed to update member", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const [membersData, visitorsData] = await Promise.all([
        getLeadershipMembers(ctx.chapterId, { search, status }),
        getLeadershipVisitors(ctx.chapterId),
      ]);
      setMembers(membersData);
      setVisitors(visitorsData);
    } catch (err) {
      console.error("Failed to load chapter roster", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, status]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !form.firstName || !form.email) return;
    setSubmitting(true);
    try {
      await addLeadershipMember({
        chapterId: context.chapterId,
        ...form,
      });
      setIsAddOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        businessName: "",
        industry: "",
        membershipNumber: "",
      });
      loadData();
    } catch (err) {
      console.error("Failed to add member", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !visitorForm.firstName || !visitorForm.email) return;
    setVisitorSubmitting(true);
    try {
      await addLeadershipVisitor({
        chapterId: context.chapterId,
        ...visitorForm,
        visitDate: new Date(),
      });
      setIsAddVisitorOpen(false);
      setVisitorForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        invitedByMemberId: "",
      });
      loadData();
    } catch (err) {
      console.error("Failed to add visitor", err);
    } finally {
      setVisitorSubmitting(false);
    }
  };

  const handleToggleStatus = async (memberId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? MemberStatus.INACTIVE : MemberStatus.ACTIVE;
    await updateMemberStatus(memberId, nextStatus);
    loadData();
  };

  const handleConvertVisitor = async (visitorId: string) => {
    if (!context) return;
    if (confirm("Convert this visitor to an active Chapter Member?")) {
      await convertLeadershipVisitor({ visitorId, chapterId: context.chapterId });
      loadData();
    }
  };

  // Group members by Month-Year
  const groupedMembers = members.reduce((acc: Record<string, any[]>, m) => {
    const dateKey = m.joinedAt || "Recent";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(m);
    return acc;
  }, {});

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Chapter Roster & Attendee Directory
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage inducted members, guest visitors, participation rates, and onboarding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "members" ? (
            <button
              onClick={() => setIsAddOpen(true)}
              className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Chapter Member
            </button>
          ) : (
            <button
              onClick={() => setIsAddVisitorOpen(true)}
              className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="h-4 w-4" /> Add Guest Visitor
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Members vs Visitors */}
      <div className="flex items-center justify-between border-b pb-1">
        <div className="flex items-center space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "members"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Inducted Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("visitors")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "visitors"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span>Guest Visitors ({visitors.length})</span>
          </button>
        </div>

        {activeTab === "members" && (
          <button
            onClick={() => setGroupByDate((prev) => !prev)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
              groupByDate ? "bg-primary/10 border-primary/30 text-primary" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{groupByDate ? "Date Accordion: ON" : "Group by Induction Date"}</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "members"
                ? "Search by member name, company, phone, email, or category..."
                : "Search visitors by guest name, company, email..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm"
          />
        </div>

        {activeTab === "members" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold"
          >
            <option value="all">All Member Statuses</option>
            <option value="ACTIVE">Active Members</option>
            <option value="PENDING">Pending Approval</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        )}
      </div>

      {/* Tab 1: Members Roster */}
      {activeTab === "members" && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="h-64 animate-pulse bg-muted/40 flex items-center justify-center text-muted-foreground">
              Loading member directory...
            </div>
          ) : groupByDate ? (
            /* Grouped Date Accordion View */
            <div className="divide-y divide-border">
              {Object.entries(groupedMembers).map(([dateKey, groupMembers]) => {
                const isExpanded = expandedGroups[dateKey] ?? true;
                return (
                  <div key={dateKey} className="p-4 space-y-3">
                    <button
                      onClick={() => toggleGroup(dateKey)}
                      className="w-full flex items-center justify-between font-bold text-sm text-foreground hover:text-primary transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <Calendar className="h-4 w-4 text-primary" /> Induction Date: {dateKey}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {groupMembers.length} Members
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 pt-1">
                        {groupMembers.map((m) => (
                          <div key={m.id} className="rounded-xl border bg-muted/15 p-3.5 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm text-foreground">{m.name}</p>
                              <p className="text-xs text-muted-foreground">{m.businessName} • {m.industry}</p>
                              <span className="text-[11px] text-muted-foreground">{m.phone}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                m.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
                              }`}>
                                {m.status}
                              </span>
                              <p className="text-xs font-semibold text-primary">{m.attendanceRate}% Turnout</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Standard Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">Member Name</th>
                    <th className="px-6 py-3 whitespace-nowrap">Business & Industry</th>
                    <th className="px-6 py-3 whitespace-nowrap">Chapter Role</th>
                    <th className="px-6 py-3 whitespace-nowrap">Attendance Rate</th>
                    <th className="px-6 py-3 whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Mail className="h-3 w-3" /> {m.email}
                          </div>
                        </td>

                        <td className="px-6 py-3.5">
                          <div className="text-foreground font-semibold">
                            {m.businessName}
                          </div>
                          <div className="text-xs text-muted-foreground">{m.industry}</div>
                        </td>

                        <td className="px-6 py-3.5">
                          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                            {m.currentRole}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 font-semibold text-emerald-600">
                          {m.attendanceRate}%
                        </td>

                        <td className="px-6 py-3.5">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            m.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {m.status}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold hover:bg-accent text-foreground inline-flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-primary" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Visitors Roster */}
      {activeTab === "visitors" && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">Visitor Name</th>
                  <th className="px-6 py-3 whitespace-nowrap">Company & Industry</th>
                  <th className="px-6 py-3 whitespace-nowrap">Visit Date</th>
                  <th className="px-6 py-3 whitespace-nowrap">Invited By</th>
                  <th className="px-6 py-3 whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No guest visitors recorded.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-foreground">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.email} • {v.phone}</div>
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-foreground">{v.company}</div>
                        <div className="text-xs text-muted-foreground">{v.industry}</div>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-muted-foreground">
                        {v.visitDate}
                      </td>

                      <td className="px-6 py-3.5 text-xs font-medium text-foreground">
                        {v.invitedBy}
                      </td>

                      <td className="px-6 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          v.status === "CONVERTED"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        }`}>
                          {v.status}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        {v.status !== "CONVERTED" && (
                          <button
                            onClick={() => handleConvertVisitor(v.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 inline-flex items-center gap-1 shadow-sm"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Induct as Member
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-foreground">Onboard New Chapter Member</h3>
              <p className="text-xs text-muted-foreground">Add an official active member to {context?.chapterName}.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Industry / Category *</label>
                  <input
                    type="text"
                    required
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Membership Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GC-MEM-104"
                  value={form.membershipNumber}
                  onChange={(e) => setForm({ ...form, membershipNumber: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Visitor Modal */}
      {isAddVisitorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-foreground">Register Chapter Visitor</h3>
              <p className="text-xs text-muted-foreground">Guest visitors can attend chapter meetings and be converted to full members.</p>
            </div>

            <form onSubmit={handleAddVisitorSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.firstName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={visitorForm.lastName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                  <input
                    type="email"
                    required
                    value={visitorForm.email}
                    onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Company</label>
                  <input
                    type="text"
                    value={visitorForm.company}
                    onChange={(e) => setVisitorForm({ ...visitorForm, company: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Industry</label>
                  <input
                    type="text"
                    value={visitorForm.industry}
                    onChange={(e) => setVisitorForm({ ...visitorForm, industry: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Invited By Member</label>
                <select
                  value={visitorForm.invitedByMemberId}
                  onChange={(e) => setVisitorForm({ ...visitorForm, invitedByMemberId: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                >
                  <option value="">Direct Lead / Walk-in</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.businessName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddVisitorOpen(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={visitorSubmitting}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {visitorSubmitting ? "Saving..." : "Add Visitor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-foreground">Edit Member Details</h3>
            <p className="text-xs text-muted-foreground">
              Update contact information, business profile, and chapter roles.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
                <input
                  type="text"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Industry / Classification</label>
                <input
                  type="text"
                  value={editForm.industry}
                  onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Chapter Role</label>
                  <select
                    value={editForm.roleName}
                    onChange={(e) => setEditForm({ ...editForm, roleName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="PRESIDENT">President</option>
                    <option value="VICE_PRESIDENT">Vice President</option>
                    <option value="TREASURER">Treasurer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Membership Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as MemberStatus })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {editSubmitting ? "Saving Changes..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
