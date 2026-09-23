"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  User,
  Camera,
  Eye,
  X,
  MapPin,
  Building2,
  Sparkles,
  LayoutGrid,
  List,
  ExternalLink,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipOneToOnes,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipOneToOnesView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "WITH_SELFIE" | "COMPLETED" | "SCHEDULED">("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");

  // Lightbox Modal for Selfie Inspection
  const [selectedSelfieSession, setSelectedSelfieSession] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const data = await getLeadershipOneToOnes(ctx.chapterId);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load 1-to-1 sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filterType === "WITH_SELFIE" && !s.selfieUrl) return false;
    if (filterType === "COMPLETED" && s.status !== "COMPLETED") return false;
    if (filterType === "SCHEDULED" && s.status !== "SCHEDULED") return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.initiator.toLowerCase().includes(q) ||
      s.receiver.toLowerCase().includes(q) ||
      (s.initiatorBusiness && s.initiatorBusiness.toLowerCase().includes(q)) ||
      (s.receiverBusiness && s.receiverBusiness.toLowerCase().includes(q)) ||
      s.outcome.toLowerCase().includes(q) ||
      (s.location && s.location.toLowerCase().includes(q))
    );
  });

  const totalCompleted = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalWithSelfie = sessions.filter((s) => Boolean(s.selfieUrl)).length;
  const totalScheduled = sessions.filter((s) => s.status === "SCHEDULED").length;

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Chapter 1-to-1 Synergy & Verified Selfies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor strategic peer-to-peer networking sessions, verified photo exchanges, and member collaboration.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto border border-border">
          <button
            onClick={() => setViewMode("GRID")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === "GRID"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode("TABLE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === "TABLE"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Recorded</p>
          <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
          <span className="text-[11px] text-muted-foreground">Peer sessions logged</span>
        </div>
        <div className="bg-card border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Camera className="h-3.5 w-3.5" /> Verified Selfies
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalWithSelfie}</p>
          <span className="text-[11px] text-muted-foreground">Photo verified meetings</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed Sessions</p>
          <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
          <span className="text-[11px] text-muted-foreground">Successfully closed</span>
        </div>
        <div className="bg-card border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Upcoming Scheduled</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalScheduled}</p>
          <span className="text-[11px] text-muted-foreground">Pipeline sessions</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by participant name, business, location, or outcome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg flex-wrap">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "ALL" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({sessions.length})
          </button>
          <button
            onClick={() => setFilterType("WITH_SELFIE")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === "WITH_SELFIE" ? "bg-card text-emerald-600 font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="h-3 w-3" /> With Selfie ({totalWithSelfie})
          </button>
          <button
            onClick={() => setFilterType("COMPLETED")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "COMPLETED" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterType("SCHEDULED")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "SCHEDULED" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      {/* Grid Cards View with Prominent Selfies */}
      {viewMode === "GRID" && (
        <>
          {loading ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground animate-pulse">
              Loading 1-to-1 networking sessions...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
              No 1-to-1 session records found matching your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((s) => {
                const isCompleted = s.status === "COMPLETED";

                return (
                  <div
                    key={s.id}
                    className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Header with status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {s.status}
                          </span>
                          {s.selfieUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <Camera className="h-3 w-3" /> Verified Photo
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-muted-foreground font-medium">
                          {s.date}
                        </span>
                      </div>

                      {/* Participants Badge */}
                      <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-foreground text-sm">{s.initiator}</p>
                            <p className="text-[11px] text-muted-foreground">{s.initiatorBusiness}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mx-2" />
                          <div className="text-right">
                            <p className="font-bold text-foreground text-sm">{s.receiver}</p>
                            <p className="text-[11px] text-muted-foreground">{s.receiverBusiness}</p>
                          </div>
                        </div>
                      </div>

                      {/* Selfie Photo Card if Available */}
                      {s.selfieUrl ? (
                        <div
                          onClick={() => setSelectedSelfieSession(s)}
                          className="relative rounded-xl overflow-hidden border border-border h-44 bg-muted/30 group cursor-pointer shadow-xs"
                        >
                          <img
                            src={s.selfieUrl}
                            alt={`1-to-1 Selfie between ${s.initiator} and ${s.receiver}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <span className="text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs px-2 py-0.5 rounded-md bg-black/40">
                              <Camera className="h-3.5 w-3.5 text-emerald-400" />
                              Verified Selfie Exchange
                            </span>
                            <span className="text-[11px] font-semibold flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-2 py-0.5 rounded-md transition-colors">
                              <Eye className="h-3 w-3" /> View Full
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-border p-4 text-center bg-muted/10 space-y-1">
                          <Camera className="h-6 w-6 text-muted-foreground mx-auto opacity-40" />
                          <p className="text-xs font-semibold text-muted-foreground">No Selfie Uploaded</p>
                          <p className="text-[10px] text-muted-foreground">Session completed without photo exchange.</p>
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{s.location}</span>
                          <span>• {s.duration} mins</span>
                        </div>
                        <div className="rounded-lg bg-muted/20 p-2.5 text-xs text-foreground border border-border/50">
                          <span className="font-bold text-muted-foreground">Outcome: </span>
                          <span>{s.outcome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === "TABLE" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Networking Session Records ({filteredSessions.length})</h3>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">Loading 1-to-1 sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No 1-to-1 session records found matching your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Verified Selfie</th>
                    <th className="py-3 px-4">Participants</th>
                    <th className="py-3 px-4">Date & Duration</th>
                    <th className="py-3 px-4">Venue / Location</th>
                    <th className="py-3 px-4">Synergy Outcome</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      {/* Selfie Thumbnail */}
                      <td className="py-3 px-4">
                        {s.selfieUrl ? (
                          <div
                            onClick={() => setSelectedSelfieSession(s)}
                            className="relative w-14 h-14 rounded-lg overflow-hidden border border-border bg-muted/40 group cursor-pointer shrink-0"
                            title="Click to view full selfie"
                          >
                            <img
                              src={s.selfieUrl}
                              alt="1-to-1 Selfie"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/10 shrink-0">
                            <Camera className="h-4 w-4 opacity-40" />
                            <span className="text-[9px] mt-0.5 opacity-60">None</span>
                          </div>
                        )}
                      </td>

                      {/* Participants */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <span>{s.initiator}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{s.receiver}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {s.initiatorBusiness} • {s.receiverBusiness}
                        </div>
                      </td>

                      {/* Date & Duration */}
                      <td className="py-3 px-4 text-xs text-foreground whitespace-nowrap">
                        <div className="font-semibold">{s.date}</div>
                        <div className="text-muted-foreground">{s.duration} minutes</div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-[180px] truncate">
                        {s.location}
                      </td>

                      {/* Outcome */}
                      <td className="py-3 px-4 text-xs text-foreground max-w-xs">
                        <p className="line-clamp-2">{s.outcome}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            s.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal for Full Selfie Inspection */}
      {selectedSelfieSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden space-y-4">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-foreground">Verified 1-to-1 Selfie Proof</h3>
              </div>
              <button
                onClick={() => setSelectedSelfieSession(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 pt-2 space-y-4">
              {/* Full Image */}
              <div className="relative rounded-xl overflow-hidden border border-border bg-black max-h-[380px] flex items-center justify-center shadow-md">
                <img
                  src={selectedSelfieSession.selfieUrl}
                  alt={`1-to-1 Selfie between ${selectedSelfieSession.initiator} and ${selectedSelfieSession.receiver}`}
                  className="max-h-[380px] w-full object-contain"
                />
              </div>

              {/* Session Meta */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground uppercase font-semibold text-[10px]">Participants</span>
                  <span className="font-bold text-foreground text-sm">
                    {selectedSelfieSession.initiator} ↔ {selectedSelfieSession.receiver}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Date:</span> {selectedSelfieSession.date}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Duration:</span> {selectedSelfieSession.duration} mins
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="font-semibold text-foreground">Location:</span> {selectedSelfieSession.location}
                  </div>
                </div>

                {selectedSelfieSession.outcome && (
                  <div className="pt-2 border-t border-border">
                    <span className="font-semibold text-foreground block mb-0.5">Synergy Discussion & Outcome:</span>
                    <p className="text-muted-foreground italic">&ldquo;{selectedSelfieSession.outcome}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedSelfieSession(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
