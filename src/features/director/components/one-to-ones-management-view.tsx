"use client";

import React, { useEffect, useState } from "react";
import { MessagesSquare, Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { getDirectorOneToOnes } from "../actions/director-actions";

export function OneToOnesManagementView() {
  const [oneToOnes, setOneToOnes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorOneToOnes();
        setOneToOnes(data);
      } catch (err) {
        console.error("Failed to load 1-to-1s", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Director 1-to-1 Networking Activity</h2>
        <p className="text-muted-foreground">Monitor strategic peer-to-peer networking meetings across assigned chapters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="h-48 rounded-xl bg-muted animate-pulse col-span-full" />
        ) : (
          oneToOnes.map((item) => (
            <div key={item.id} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-primary uppercase">{item.chapterName}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">{item.status}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-foreground text-sm">
                <span>{item.initiatorName}</span>
                <span className="text-muted-foreground text-xs font-normal">↔</span>
                <span>{item.receiverName}</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(item.date).toLocaleDateString()}</p>
                <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> {item.duration} minutes</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {item.location}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Outcome:</span> {item.outcome}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
