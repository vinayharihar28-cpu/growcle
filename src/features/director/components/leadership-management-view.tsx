"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, Building2, Plus, AlertTriangle, CheckCircle2, UserX } from "lucide-react";
import { getDirectorLeadership, getDirectorMembers } from "../actions/director-actions";
import { AssignLeadershipModal } from "./assign-leadership-modal";

export function LeadershipManagementView() {
  const [leadershipChapters, setLeadershipChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [assignModalState, setAssignModalState] = useState<{
    isOpen: boolean;
    chapterId: string;
    chapterName: string;
    position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  }>({
    isOpen: false,
    chapterId: "",
    chapterName: "",
    position: "PRESIDENT",
  });

  const [membersForAssign, setMembersForAssign] = useState<{ id: string; name: string; email: string }[]>([]);

  const loadLeadership = async () => {
    setLoading(true);
    try {
      const data = await getDirectorLeadership();
      setLeadershipChapters(data);
    } catch (err) {
      console.error("Failed to load leadership workspace", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadership();
  }, []);

  const handleOpenAssign = async (
    chapterId: string,
    chapterName: string,
    position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER"
  ) => {
    const mems = await getDirectorMembers({ chapterId });
    setMembersForAssign(mems.map((m) => ({ id: m.id, name: `${m.firstName} ${m.lastName}`, email: m.email })));
    setAssignModalState({
      isOpen: true,
      chapterId,
      chapterName,
      position,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Leadership Management Workspace</h2>
        <p className="text-muted-foreground">
          Monitor chapter executive officers (President, Vice President, Treasurer), fill vacancies, and replace leadership across assigned chapters.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leadershipChapters.map((item) => (
            <div key={item.chapterId} className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{item.chapterName}</h3>
                  <span className="text-xs text-muted-foreground">{item.chapterCode} • {item.region}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.vacancies === 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {item.vacancies === 0 ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Staffed
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" /> {item.vacancies} Vacancy
                    </>
                  )}
                </span>
              </div>

              {/* Position 1: President */}
              <div className="rounded-lg border bg-background p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">President</span>
                  {item.president ? (
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "PRESIDENT")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Replace
                    </button>
                  ) : null}
                </div>
                {item.president ? (
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.president.name}</p>
                    <p className="text-xs text-muted-foreground">{item.president.business || item.president.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold italic">Unassigned Slot</span>
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "PRESIDENT")}
                      className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Assign President
                    </button>
                  </div>
                )}
              </div>

              {/* Position 2: Vice President */}
              <div className="rounded-lg border bg-background p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vice President</span>
                  {item.vicePresident ? (
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "VICE_PRESIDENT")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Replace
                    </button>
                  ) : null}
                </div>
                {item.vicePresident ? (
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.vicePresident.name}</p>
                    <p className="text-xs text-muted-foreground">{item.vicePresident.business || item.vicePresident.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold italic">Unassigned Slot</span>
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "VICE_PRESIDENT")}
                      className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Assign Vice President
                    </button>
                  </div>
                )}
              </div>

              {/* Position 3: Treasurer */}
              <div className="rounded-lg border bg-background p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Treasurer</span>
                  {item.treasurer ? (
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "TREASURER")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Replace
                    </button>
                  ) : null}
                </div>
                {item.treasurer ? (
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.treasurer.name}</p>
                    <p className="text-xs text-muted-foreground">{item.treasurer.business || item.treasurer.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold italic">Unassigned Slot</span>
                    <button
                      onClick={() => handleOpenAssign(item.chapterId, item.chapterName, "TREASURER")}
                      className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Assign Treasurer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      <AssignLeadershipModal
        isOpen={assignModalState.isOpen}
        onClose={() => setAssignModalState((prev) => ({ ...prev, isOpen: false }))}
        chapterId={assignModalState.chapterId}
        chapterName={assignModalState.chapterName}
        initialPosition={assignModalState.position}
        availableMembers={membersForAssign}
        onSuccess={loadLeadership}
      />
    </div>
  );
}
