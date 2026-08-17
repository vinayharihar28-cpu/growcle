"use client";

import * as React from "react";
import { getReferrals } from "../actions/referrals";
import { useAuthStore } from "@/shared/stores/auth";
import { UpdateReferralStatusModal } from "./update-referral-status-modal";
import { LogReferralModal } from "./log-referral-modal";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Handshake, Search, Filter, ArrowUpDown, Plus, RefreshCw, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

export function MemberReferralsTable() {
  const { currentMember } = useAuthStore();
  const [referrals, setReferrals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Filter & Sorting state
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [typeFilter, setTypeFilter] = React.useState<"ALL" | "GIVEN" | "RECEIVED">("ALL");
  const [sortAsc, setSortAsc] = React.useState(false);

  // Modal State
  const [selectedReferral, setSelectedReferral] = React.useState<any | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);

  const loadReferrals = React.useCallback(async () => {
    if (!currentMember?.id) return;
    try {
      setLoading(true);
      const list = await getReferrals(currentMember.id);
      setReferrals(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentMember?.id]);

  React.useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  // Filter & Sorting Logic
  const filteredReferrals = React.useMemo(() => {
    return referrals
      .filter((ref) => {
        // Status filter
        if (statusFilter !== "ALL" && ref.status !== statusFilter) return false;
        // Given vs Received filter
        if (typeFilter === "GIVEN" && ref.fromMemberId !== currentMember?.id) return false;
        if (typeFilter === "RECEIVED" && ref.toMemberId !== currentMember?.id) return false;
        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const nameMatch = ref.referralName?.toLowerCase().includes(q);
          const fromMatch = `${ref.fromMember?.firstName} ${ref.fromMember?.lastName}`.toLowerCase().includes(q);
          const toMatch = `${ref.toMember?.firstName} ${ref.toMember?.lastName}`.toLowerCase().includes(q);
          return nameMatch || fromMatch || toMatch;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortAsc ? timeA - timeB : timeB - timeA;
      });
  }, [referrals, statusFilter, typeFilter, search, sortAsc, currentMember?.id]);

  const handleOpenUpdate = (ref: any) => {
    setSelectedReferral(ref);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" /> My Referral Pipeline
          </h2>
          <p className="text-xs text-muted-foreground">
            Track business referrals passed and received. Update statuses to record verified closed revenue.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsLogModalOpen(true)}
          className="h-10 px-5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Log New Referral
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prospect or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-2xl bg-card"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-full rounded-2xl border border-input bg-card px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="flex h-10 w-full rounded-2xl border border-input bg-card px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="ALL">All Types (Given & Received)</option>
          <option value="GIVEN">Given by Me</option>
          <option value="RECEIVED">Received by Me</option>
        </select>
      </div>

      {/* Referrals Data Table Card */}
      <Card className="rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-sm font-bold">Referral Log</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredReferrals.length} referrals
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Sort by Date ({sortAsc ? "Oldest" : "Newest"})</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-muted-foreground">Loading referral pipeline...</p>
            </div>
          ) : filteredReferrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-6">Prospect / Business</th>
                    <th className="py-3 px-6">Direction</th>
                    <th className="py-3 px-6">Member</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Value ($)</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {filteredReferrals.map((ref) => {
                    const isGiven = ref.fromMemberId === currentMember?.id;
                    const otherMember = isGiven ? ref.toMember : ref.fromMember;

                    return (
                      <tr key={ref.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* Referral Name */}
                        <td className="py-3.5 px-6 font-semibold text-foreground">
                          <div>{ref.referralName}</div>
                          {ref.referralEmail && (
                            <div className="text-[11px] text-muted-foreground font-normal">{ref.referralEmail}</div>
                          )}
                        </td>

                        {/* Direction */}
                        <td className="py-3.5 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isGiven 
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" 
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {isGiven ? "Given" : "Received"}
                          </span>
                        </td>

                        {/* Member */}
                        <td className="py-3.5 px-6 font-medium text-foreground">
                          {otherMember ? `${otherMember.firstName} ${otherMember.lastName}` : "Member"}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-6 text-muted-foreground">
                          {ref.category || "Tier 1"}
                        </td>

                        {/* Value */}
                        <td className="py-3.5 px-6 font-bold text-foreground">
                          {ref.value ? `$${ref.value.toLocaleString()}` : "—"}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ref.status === "CLOSED_WON"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : ref.status === "CONTACTED"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : ref.status === "CLOSED_LOST"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}>
                            {ref.status === "CLOSED_WON" && <CheckCircle2 className="h-3 w-3" />}
                            {ref.status === "CONTACTED" && <RefreshCw className="h-3 w-3" />}
                            {ref.status === "PENDING" && <Clock className="h-3 w-3" />}
                            {ref.status === "CLOSED_LOST" && <XCircle className="h-3 w-3" />}
                            <span>{ref.status}</span>
                          </span>
                        </td>

                        {/* Action Button */}
                        <td className="py-3.5 px-6 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUpdate(ref)}
                            className="rounded-xl text-xs h-8 px-3"
                          >
                            Update Status
                          </Button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground space-y-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground/60 mx-auto" />
              <p className="text-sm font-semibold">No referrals found matching your filter criteria.</p>
              <Button onClick={() => setIsLogModalOpen(true)} variant="outline" className="rounded-xl text-xs">
                Log Your First Referral
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Modals */}
      <LogReferralModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={loadReferrals}
      />

      <UpdateReferralStatusModal
        referral={selectedReferral}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={loadReferrals}
      />

    </div>
  );
}
