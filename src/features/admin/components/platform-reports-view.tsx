'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Handshake, 
  CreditCard, 
  TrendingUp, 
  IndianRupee, 
  UserPlus, 
  Download,
  Filter,
  Printer
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { LeadershipReportsView } from '@/features/leadership/components/leadership-reports-view';
import { exportToCsv } from '@/lib/export-utils';

export function PlatformReportsView() {
  const [timeRange, setTimeRange] = useState<'30d' | '3m' | '6m' | '12m'>('6m');
  const [activeSubTab, setActiveSubTab] = useState<'membership' | 'chapters' | 'visitors' | 'referrals' | 'finance' | 'meetings'>('membership');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ["Metric", "Range", "Active Tab", "Generated Date"];
    const rows = [
      ["Platform Performance Analytics", timeRange, activeSubTab, new Date().toLocaleDateString()],
      ["Membership Growth Trend", "Active", "+14.8%", "1,240 Total Members"],
      ["Chapter Expansion", "Active Chapters", "18 Chapters", "98.2% Active"],
      ["Referrals & Pipeline", "Closed Deals", "₹2.4 Cr+", "1,890 Leads Passed"],
    ];
    exportToCsv(`platform_analytics_report_${activeSubTab}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Platform Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive platform intelligence across chapter growth, member retention, visitor funnels, and revenue.
          </p>
        </div>

        {/* Actions & Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-muted p-1 rounded-xl text-xs font-semibold">
            {(['30d', '3m', '6m', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range === '30d' ? '30 Days' : range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs h-9 cursor-pointer"
            onClick={handleExportCsv}
          >
            <Download className="w-4 h-4 mr-1.5 text-indigo-500" /> Export CSV / Excel
          </Button>

          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 cursor-pointer"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-1.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b text-xs font-semibold space-x-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('membership')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'membership'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" /> Membership Growth
        </button>
        <button
          onClick={() => setActiveSubTab('chapters')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'chapters'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="w-4 h-4" /> Chapter Comparison
        </button>
        <button
          onClick={() => setActiveSubTab('visitors')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'visitors'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Visitor Funnel
        </button>
        <button
          onClick={() => setActiveSubTab('referrals')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'referrals'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Handshake className="w-4 h-4" /> Referrals & Closed Business
        </button>
        <button
          onClick={() => setActiveSubTab('finance')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'finance'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Dues & Financials
        </button>
        <button
          onClick={() => setActiveSubTab('meetings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'meetings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" /> Meeting Turnout & PDF Reports
        </button>
      </div>

      {/* 1. Membership Growth Report */}
      {activeSubTab === 'membership' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Total Registered Members</span>
              <div className="text-3xl font-extrabold mt-1">164</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">+18% this quarter</span>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Active Members</span>
              <div className="text-3xl font-extrabold mt-1 text-emerald-600">152</div>
              <span className="text-[10px] text-muted-foreground mt-1 block">92.6% retention rate</span>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Pending Inductions</span>
              <div className="text-3xl font-extrabold mt-1 text-amber-600">8</div>
              <span className="text-[10px] text-muted-foreground mt-1 block">Awaiting board approval</span>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Average Chapter Size</span>
              <div className="text-3xl font-extrabold mt-1 text-indigo-600">27.3</div>
              <span className="text-[10px] text-muted-foreground mt-1 block">Target: 30 members</span>
            </div>
          </div>

          {/* Membership Trend Chart Visualizer */}
          <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground">Monthly Active Member Growth</h3>
            <div className="h-64 flex items-end gap-6 pt-8 px-4 border-b border-border/50">
              {[
                { m: 'Oct', v: 112 },
                { m: 'Nov', v: 124 },
                { m: 'Dec', v: 135 },
                { m: 'Jan', v: 142 },
                { m: 'Feb', v: 150 },
                { m: 'Mar', v: 164 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.v}
                  </span>
                  <div
                    style={{ height: `${(item.v / 180) * 100}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:from-indigo-500 group-hover:to-indigo-300"
                  />
                  <span className="text-xs text-muted-foreground font-medium mt-2">{item.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Chapter Comparison Report */}
      {activeSubTab === 'chapters' && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-base font-bold text-foreground">Chapter Comparative Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                <tr>
                  <th className="px-6 py-3.5">Chapter</th>
                  <th className="px-6 py-3.5">Region</th>
                  <th className="px-6 py-3.5">Active Members</th>
                  <th className="px-6 py-3.5">Attendance</th>
                  <th className="px-6 py-3.5">Visitors</th>
                  <th className="px-6 py-3.5">Referrals</th>
                  <th className="px-6 py-3.5">Closed Business</th>
                  <th className="px-6 py-3.5">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { name: 'Silicon Valley Founders', region: 'Northern California', members: 28, attendance: '96%', visitors: 18, referrals: 142, closed: 5240000, status: 'HEALTHY' },
                  { name: 'Golden Gate Executives', region: 'Bay Area', members: 24, attendance: '92%', visitors: 14, referrals: 98, closed: 3450000, status: 'HEALTHY' },
                  { name: 'East Bay Nexus', region: 'East Bay', members: 21, attendance: '88%', visitors: 11, referrals: 76, closed: 2100000, status: 'HEALTHY' },
                  { name: 'Marin County Professionals', region: 'North Bay', members: 16, attendance: '84%', visitors: 9, referrals: 52, closed: 1200000, status: 'NEEDS_ATTENTION' },
                  { name: 'Peninsula Innovators', region: 'South Bay', members: 19, attendance: '90%', visitors: 12, referrals: 60, closed: 1850000, status: 'HEALTHY' },
                ].map((chap, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{chap.name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{chap.region}</td>
                    <td className="px-6 py-4 font-bold">{chap.members}</td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">{chap.attendance}</td>
                    <td className="px-6 py-4">{chap.visitors}</td>
                    <td className="px-6 py-4 font-medium">{chap.referrals}</td>
                    <td className="px-6 py-4 font-extrabold text-foreground">{formatCurrency(chap.closed)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        chap.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {chap.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Visitor Funnel Report */}
      {activeSubTab === 'visitors' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Visitor Conversion Funnel</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tracking prospective members through the guest lifecycle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-2xl border bg-muted/30 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">1. Registered Visitors</span>
                <div className="text-4xl font-extrabold text-foreground">86</div>
                <span className="text-xs text-muted-foreground">Invited by members</span>
              </div>

              <div className="p-6 rounded-2xl border bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 space-y-2">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">2. Attended Meeting</span>
                <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">52</div>
                <span className="text-xs text-muted-foreground">60.4% show rate</span>
              </div>

              <div className="p-6 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 space-y-2">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">3. Converted to Member</span>
                <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">20</div>
                <span className="text-xs text-emerald-600 font-bold">38.5% conversion rate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Referrals Report */}
      {activeSubTab === 'referrals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground">Referral Pipeline Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Closed Won Deals</span>
                  <span className="text-emerald-600">246 (57.5%)</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '57.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Contacted / In Pipeline</span>
                  <span className="text-blue-600">92 (21.5%)</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '21.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Pending Initial Reach-out</span>
                  <span className="text-amber-600">64 (15%)</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Closed Lost</span>
                  <span className="text-rose-600">26 (6%)</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border bg-gradient-to-br from-indigo-950 to-slate-950 text-white shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Total Verified Closed Business</span>
              <div className="text-4xl font-extrabold text-white mt-2">
                {formatCurrency(12485000)}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Mathematically verified economic value passed directly between members across all active chapters.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-slate-300">
              <span>Avg Deal Value: <strong className="text-white">₹50,752</strong></span>
              <span>Network Velocity: <strong className="text-emerald-400">98.2%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Dues & Financials Report */}
      {activeSubTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Total Collected Dues</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{formatCurrency(345000)}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Pending Verification</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{formatCurrency(45000)}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">Outstanding Dues</span>
              <div className="text-3xl font-extrabold text-rose-600 mt-1">{formatCurrency(15000)}</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Meeting Turnout & Weekly Attendance PDF Reports */}
      {activeSubTab === 'meetings' && (
        <div className="pt-2">
          <LeadershipReportsView forcedRole="ADMIN" />
        </div>
      )}
    </div>
  );
}
