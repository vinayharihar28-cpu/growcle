"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { getDirectorPayments, getAssignedChapters } from "../actions/director-actions";

export function PaymentsManagementView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorPayments(chapterId);
        setPayments(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Payment & Finance Oversight</h2>
        <p className="text-muted-foreground">Monitor chapter membership payments, dues, pending collections, and financial health.</p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium"
        >
          <option value="all">All Assigned Chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

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
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Invoice Ref</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold text-foreground">{p.memberName}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{p.chapterName}</td>
                    <td className="px-6 py-4 font-bold text-foreground">${p.amount} {p.currency}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{p.reference}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{p.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === "SUCCEEDED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : p.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
