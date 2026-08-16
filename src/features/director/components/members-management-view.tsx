"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  Building2,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { getDirectorMembers, getAssignedChapters, addDirectorMember } from "../actions/director-actions";
import { MemberRoleModal } from "./member-role-modal";

export function MembersManagementView() {
  const [members, setMembers] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [chapterId, setChapterId] = useState("all");
  const [status, setStatus] = useState("all");

  // Role change modal
  const [roleModalState, setRoleModalState] = useState<{
    isOpen: boolean;
    member: any | null;
  }>({ isOpen: false, member: null });

  // Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    chapterId: "",
    businessName: "",
    industry: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getDirectorMembers({ search, chapterId, status });
      setMembers(data);
      const chaps = await getAssignedChapters();
      setChapters(chaps);
      if (chaps.length > 0 && !newMemberForm.chapterId) {
        setNewMemberForm((prev) => ({ ...prev, chapterId: chaps[0].id }));
      }
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [search, chapterId, status]);

  const handleAddMemberSubmit = async () => {
    if (!newMemberForm.firstName || !newMemberForm.email || !newMemberForm.chapterId) return;
    setAddLoading(true);
    try {
      await addDirectorMember(newMemberForm);
      setIsAddMemberOpen(false);
      setNewMemberForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        chapterId: chapters[0]?.id || "",
        businessName: "",
        industry: "",
      });
      loadMembers();
    } catch (err) {
      console.error("Failed to add member", err);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Member Management</h2>
          <p className="text-muted-foreground">Manage members, update profile info, and assign member roles across assigned chapters.</p>
        </div>
        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by member name, email, membership #, or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Assigned Chapters</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Roster Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 animate-pulse bg-muted" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Chapter</th>
                  <th className="px-6 py-3">Business & Industry</th>
                  <th className="px-6 py-3">Current Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No members found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5"><Mail className="h-3 w-3" /> {m.email}</span>
                          <span>• #{m.membershipNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{m.chapterName}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{m.businessName}</div>
                        <div className="text-xs text-muted-foreground">{m.industry}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                          m.currentRole !== "MEMBER"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {m.currentRole}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setRoleModalState({ isOpen: true, member: m })}
                          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold hover:bg-accent transition-colors"
                        >
                          <ShieldAlert className="h-3.5 w-3.5 text-primary" /> Change Role
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

      {/* Role Change Modal */}
      <MemberRoleModal
        isOpen={roleModalState.isOpen}
        onClose={() => setRoleModalState({ isOpen: false, member: null })}
        member={roleModalState.member ? {
          id: roleModalState.member.id,
          name: `${roleModalState.member.firstName} ${roleModalState.member.lastName}`,
          email: roleModalState.member.email,
          chapterId: roleModalState.member.chapterId,
          chapterName: roleModalState.member.chapterName,
          currentRole: roleModalState.member.currentRole,
        } : null}
        onSuccess={loadMembers}
      />

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold">Add Member to Chapter</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">First Name</label>
                  <input
                    type="text"
                    value={newMemberForm.firstName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, firstName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newMemberForm.lastName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, lastName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={newMemberForm.email}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Assigned Chapter</label>
                <select
                  value={newMemberForm.chapterId}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, chapterId: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Business Name</label>
                <input
                  type="text"
                  value={newMemberForm.businessName}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, businessName: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Industry</label>
                <input
                  type="text"
                  value={newMemberForm.industry}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, industry: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsAddMemberOpen(false)} className="rounded-md border px-4 py-2 text-sm font-semibold">Cancel</button>
              <button onClick={handleAddMemberSubmit} disabled={addLoading} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                {addLoading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
