"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Search, Plus, Mail, Phone, Building2, CheckCircle2, UserCheck, ArrowRight, Edit3 } from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipVisitors,
  addLeadershipVisitor,
  updateLeadershipVisitor,
  updateLeadershipVisitorStatus,
  convertLeadershipVisitor,
  LeadershipContext,
} from "../actions/leadership-actions";
import { VisitorStatus } from "@prisma/client";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipVisitorsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    visitDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Convert Visitor state
  const [convertingVisitor, setConvertingVisitor] = useState<any | null>(null);
  const [convertSubmitting, setConvertSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const data = await getLeadershipVisitors(ctx.chapterId, statusFilter);
      setVisitors(data);
    } catch (err) {
      console.error("Failed to load visitors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !addForm.firstName || !addForm.email) return;
    setSubmitting(true);
    try {
      await addLeadershipVisitor({
        chapterId: context.chapterId,
        firstName: addForm.firstName,
        lastName: addForm.lastName,
        email: addForm.email,
        phone: addForm.phone,
        company: addForm.company,
        industry: addForm.industry,
        visitDate: new Date(addForm.visitDate),
        notes: addForm.notes,
      });
      setIsAddOpen(false);
      setAddForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        visitDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to add visitor", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Visitor Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    notes: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleOpenEditVisitor = (visitor: any) => {
    const nameParts = (visitor.name || "").split(" ");
    const fName = visitor.firstName || nameParts[0] || "";
    const lName = visitor.lastName || nameParts.slice(1).join(" ") || "";
    setEditingVisitor(visitor);
    setEditForm({
      firstName: fName,
      lastName: lName,
      email: visitor.email || "",
      phone: visitor.phone === "N/A" ? "" : (visitor.phone || ""),
      company: visitor.company || "",
      industry: visitor.industry || "",
      notes: visitor.notes || "",
    });
    setIsEditOpen(true);
  };

  const handleEditVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVisitor || !editForm.firstName || !editForm.email) return;
    setEditSubmitting(true);
    try {
      await updateLeadershipVisitor({
        visitorId: editingVisitor.id,
        ...editForm,
      });
      setIsEditOpen(false);
      setEditingVisitor(null);
      await loadData();
    } catch (err) {
      console.error("Failed to update visitor", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleStatusChange = async (visitorId: string, newStatus: VisitorStatus) => {
    try {
      await updateLeadershipVisitorStatus(visitorId, newStatus);
      await loadData();
    } catch (err) {
      console.error("Failed to update visitor status", err);
    }
  };

  const handleConvert = async (visitor: any) => {
    if (!context) return;
    setConvertSubmitting(true);
    try {
      await convertLeadershipVisitor({
        visitorId: visitor.id,
        chapterId: context.chapterId,
      });
      setConvertingVisitor(null);
      setIsEditOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to convert visitor", err);
    } finally {
      setConvertSubmitting(false);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.industry.toLowerCase().includes(q)
    );
  });

  const totalCount = visitors.length;
  const pendingCount = visitors.filter((v) => v.status === "PENDING").length;
  const attendedCount = visitors.filter((v) => v.status === "ATTENDED").length;
  const convertedCount = visitors.filter((v) => v.status === "CONVERTED").length;
  const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Visitor KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Registered</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming / Pending</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attended Guests</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{attendedCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Converted Members</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              {conversionRate}% Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{convertedCount}</p>
        </div>
      </div>

      {/* Action and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by visitor name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ATTENDED">Attended</option>
            <option value="CONVERTED">Converted</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Visitor</span>
        </button>
      </div>

      {/* Visitors Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Chapter Visitors Directory</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredVisitors.length} guests
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading chapter visitors...</div>
        ) : filteredVisitors.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No visitors found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Business & Sector</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Visit Date</th>
                  <th className="py-3 px-4">Invited By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{v.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{v.notes}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{v.company}</div>
                      <div className="text-xs text-muted-foreground">{v.industry}</div>
                    </td>
                    <td className="py-3 px-4 text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{v.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{v.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {v.visitDate}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {v.invitedBy}
                    </td>
                    <td className="py-3 px-4">
                      {v.status === "CONVERTED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Converted Member
                        </span>
                      ) : (
                        <select
                          value={v.status === "ATTENDED" ? "ATTENDED" : "NO_SHOW"}
                          onChange={(e) => handleStatusChange(v.id, e.target.value as VisitorStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${
                            v.status === "ATTENDED"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="ATTENDED">Attended</option>
                          <option value="NO_SHOW">Not Attended</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditVisitor(v)}
                        className="rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold hover:bg-accent text-foreground inline-flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Visitor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Register New Chapter Visitor</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.firstName}
                    onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={addForm.lastName}
                    onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.company}
                    onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry / Category</label>
                  <input
                    type="text"
                    value={addForm.industry}
                    onChange={(e) => setAddForm({ ...addForm, industry: e.target.value })}
                    placeholder="e.g. Financial Advisory"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Scheduled Visit Date</label>
                <input
                  type="date"
                  value={addForm.visitDate}
                  onChange={(e) => setAddForm({ ...addForm, visitDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes / Purpose</label>
                <textarea
                  rows={2}
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  placeholder="Visitor interest, guest of, or industry notes..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visitor Modal */}
      {isEditOpen && editingVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Edit Visitor Details</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingVisitor(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditVisitorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company Name</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry / Category</label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes / Purpose</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Visitor interest, guest of, or industry notes..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Conversion callout inside edit modal */}
              {editingVisitor.status !== "CONVERTED" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ready to join chapter?</div>
                    <div className="text-[11px] text-muted-foreground">Enroll this visitor directly as a member</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConvertingVisitor(editingVisitor);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Convert to Member
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingVisitor(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Visitor to Member Confirmation Modal */}
      {convertingVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-500">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Convert Visitor to Active Member</h3>
                <p className="text-xs text-muted-foreground">Add to {context?.chapterName} roster</p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-xs text-foreground">
              <div>
                <span className="text-muted-foreground">Candidate: </span>
                <span className="font-semibold">{convertingVisitor.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span>{convertingVisitor.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Business: </span>
                <span className="font-semibold">{convertingVisitor.company}</span> ({convertingVisitor.industry})
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This action will instantly enroll <strong>{convertingVisitor.name}</strong> as an Active Member in this chapter, generate their membership records, and update their visitor profile to Converted.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConvertingVisitor(null)}
                className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={convertSubmitting}
                onClick={() => handleConvert(convertingVisitor)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {convertSubmitting ? "Converting..." : "Confirm Membership"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
