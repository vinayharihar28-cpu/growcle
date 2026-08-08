"use client";

import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { TrendingUp, Users, ShieldCheck, Check, Network, Calendar, Star, BarChart3, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function ShowcasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#030712] text-slate-100">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-b from-[#090d16] to-[#030712]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Platform Tour
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mt-4">
              Visual <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-200 to-white">App Showcase</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Take a walk through the beautiful workspaces, statistics tools, and chapter governance engines built inside Growcle.
            </p>
          </div>
        </section>

        {/* Mockups List */}
        <section className="py-16 container mx-auto px-4 max-w-7xl space-y-32">
          
          {/* Mockup 1: Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-white">Advanced Member Analytics</h2>
              <p className="text-slate-400 leading-relaxed">
                Log closed revenue, track passed referrals, and measure your exact Return on Investment. Every metric is computed dynamically to prove the value of your business relationships.
              </p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-indigo-500" />
                  <span>Real-time TYFCB (Thank You For Closed Business) graphs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-indigo-500" />
                  <span>Interactive referrals funnel analysis</span>
                </div>
              </div>
            </div>

            {/* High Fidelity CSS Dashboard Mockup */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative group overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100" />
              {/* Window Controls */}
              <div className="flex gap-2 mb-6 border-b border-slate-800/80 pb-4">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 ml-4 font-mono">dashboard/member-analytics</span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Closed Revenue</span>
                  <div className="text-xl font-bold mt-1 text-emerald-400">$1,248,500</div>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12.4% vs last mo
                  </span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Referrals Passed</span>
                  <div className="text-xl font-bold mt-1 text-indigo-400">428</div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">98% Conversion rate</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400">1-to-1 Meetings</span>
                  <div className="text-xl font-bold mt-1 text-pink-400">54</div>
                  <span className="text-[10px] text-pink-500 font-semibold block mt-1">Average 2.4/member</span>
                </div>
              </div>

              {/* Chart Mockup */}
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-slate-300">Revenue Growth Trend</span>
                  <div className="flex gap-2 text-[10px] text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">6 Months</span>
                    <span className="px-2 py-0.5 rounded">1 Year</span>
                  </div>
                </div>
                <div className="h-44 flex items-end gap-3 pt-6 px-4">
                  {[45, 60, 55, 80, 75, 110, 140].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div 
                        style={{ height: `${h}%` }} 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md relative group-hover:brightness-110 transition-all"
                      />
                      <span className="text-[9px] text-slate-500">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mockup 2: PALMS Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 lg:order-last space-y-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Network className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-white">Chapter Attendance & PALMS</h2>
              <p className="text-slate-400 leading-relaxed">
                Establish high engagement standards. Automatically log attendance, substitutions, late entries, and track member accountability indicators (Present, Absent, Late, Medical/Sub, Sent Referral).
              </p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-pink-500" />
                  <span>Instant attendance reports for leadership teams</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-pink-500" />
                  <span>Visual dashboard highlights top-performing chapters</span>
                </div>
              </div>
            </div>

            {/* High Fidelity CSS PALMS Table Mockup */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-100" />
              {/* Window Controls */}
              <div className="flex gap-2 mb-6 border-b border-slate-800/80 pb-4">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 ml-4 font-mono">chapter/attendance-matrix</span>
              </div>

              {/* PALMS Matrix */}
              <div className="space-y-3">
                {[
                  { name: "Sarah Connor", role: "Software Agency", p: "bg-emerald-500 text-white", a: "bg-slate-800 text-slate-500", l: "bg-slate-800 text-slate-500", m: "bg-slate-800 text-slate-500", s: "bg-indigo-500 text-white" },
                  { name: "Bruce Wayne", role: "Investment Advisor", p: "bg-slate-800 text-slate-500", a: "bg-rose-500 text-white", l: "bg-slate-800 text-slate-500", m: "bg-slate-800 text-slate-500", s: "bg-slate-800 text-slate-500" },
                  { name: "Diana Prince", role: "Art Gallery Curator", p: "bg-emerald-500 text-white", a: "bg-slate-800 text-slate-500", l: "bg-amber-500 text-white", m: "bg-slate-800 text-slate-500", s: "bg-indigo-500 text-white" },
                  { name: "Clark Kent", role: "Public Relations Specialist", p: "bg-emerald-500 text-white", a: "bg-slate-800 text-slate-500", l: "bg-slate-800 text-slate-500", m: "bg-teal-500 text-white", s: "bg-indigo-500 text-white" },
                ].map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-850 gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{row.name}</div>
                      <div className="text-[10px] text-slate-500">{row.role}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${row.p}`}>P</span>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${row.a}`}>A</span>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${row.l}`}>L</span>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${row.m}`}>M</span>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${row.s}`}>S</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mockup 3: RBAC Controller */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-white">Enterprise Role & Governance Controls</h2>
              <p className="text-slate-400 leading-relaxed">
                Configure precise operational control. Enable chapter administrators to configure customized permissions grids, customize roles (President, Secretary, Visitor), and govern operational details.
              </p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>Granular permission levels with checkmarks toggles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>Security-first workspace audit controls</span>
                </div>
              </div>
            </div>

            {/* High Fidelity CSS RBAC Control Mockup */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-100" />
              {/* Window Controls */}
              <div className="flex gap-2 mb-6 border-b border-slate-800/80 pb-4">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 ml-4 font-mono">settings/role-permissions-matrix</span>
              </div>

              {/* RBAC Table Mock */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/20 text-xs">
                <div className="grid grid-cols-4 bg-slate-900/60 p-3 font-semibold text-slate-400 border-b border-slate-800/80">
                  <span>Permission Title</span>
                  <span className="text-center">Admin</span>
                  <span className="text-center">Member</span>
                  <span className="text-center">Visitor</span>
                </div>
                {[
                  { name: "Manage Chapter Roster", ad: true, me: false, vi: false },
                  { name: "Pass Referrals & TYFCB", ad: true, me: true, vi: false },
                  { name: "Access Chapter Dashboard", ad: true, me: true, vi: true },
                  { name: "Override Audit Attendance", ad: true, me: false, vi: false },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 p-3 border-b border-slate-850/60 text-slate-300 hover:bg-slate-900/30">
                    <span>{row.name}</span>
                    <span className="flex justify-center">{row.ad ? <Check className="h-4 w-4 text-emerald-500" /> : "-"}</span>
                    <span className="flex justify-center">{row.me ? <Check className="h-4 w-4 text-emerald-500" /> : "-"}</span>
                    <span className="flex justify-center">{row.vi ? <Check className="h-4 w-4 text-emerald-500" /> : "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* CTA section */}
        <section className="bg-primary px-6 py-20 sm:py-28 text-center text-primary-foreground">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Step Inside the Growth Engine</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Register to attend an upcoming chapter meeting today as a visitor and see these features run live.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/chapters">Browse Chapters</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/register">Register as Visitor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-slate-950/80">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Growcle White-Label SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
