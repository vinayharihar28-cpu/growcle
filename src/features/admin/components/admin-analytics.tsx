'use client';

import { AdminStats, ChapterDetails } from '@/types/admin';
import { useState, useEffect } from 'react';
import { AdminService } from '../services/admin-service';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Users, Filter, Download, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function AdminAnalytics({ stats }: { stats: AdminStats }) {
  const [chapters, setChapters] = useState<ChapterDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getChapters().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Visual Funnels & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visitor Conversion Funnel */}
        <div className="p-6 rounded-2xl border bg-card shadow-xs">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">Visitor Conversion Funnel</h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-full bg-muted rounded-r-xl h-10 flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-blue-500/20 w-full"></div>
                <span className="relative z-10 px-4 text-xs font-bold text-blue-700">Total Visitors</span>
              </div>
              <span className="font-extrabold w-12 text-right">{stats.visitors.total}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-[85%] bg-muted rounded-r-xl h-10 flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-amber-500/20 w-full"></div>
                <span className="relative z-10 px-4 text-xs font-bold text-amber-700">Attended Meeting</span>
              </div>
              <span className="font-extrabold w-12 text-right">{stats.visitors.attended}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-[40%] bg-muted rounded-r-xl h-10 flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 w-full"></div>
                <span className="relative z-10 px-4 text-xs font-bold text-emerald-700">Converted to Member</span>
              </div>
              <span className="font-extrabold w-12 text-right">{stats.visitors.converted}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Overall Conversion Rate</span>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">
              {Math.round((stats.visitors.converted / stats.visitors.attended) * 100)}%
            </span>
          </div>
        </div>

        {/* Member Growth */}
        <div className="p-6 rounded-2xl border bg-card shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">Member Growth (YTD)</h3>
            <select className="text-xs border rounded-md px-2 py-1 bg-background text-muted-foreground outline-hidden">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 pt-4 h-40">
            {/* Mock Chart Bars */}
            {[45, 52, 68, 74, 89, 102, 125, 148, 180, 210, 250, 286].map((val, idx) => (
              <div key={idx} className="w-full bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500 transition-colors group relative" style={{ height: `${(val / 300) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 shadow-md pointer-events-none transition-opacity">
                  {val}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase font-semibold">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

      </div>

      {/* Chapter Performance Table */}
      <div className="border rounded-2xl bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h3 className="font-bold text-sm text-foreground">Chapter Performance Matrix</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="w-3.5 h-3.5 mr-1" /> Filter</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="w-3.5 h-3.5 mr-1" /> Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Chapter Name</th>
                <th className="p-4">Active Members</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Visitor Conv.</th>
                <th className="p-4">Referrals</th>
                <th className="p-4">Closed Business</th>
                <th className="p-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-accent/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-foreground">{chapter.name}</div>
                    <div className="text-[10px] text-muted-foreground">{chapter.code} • {chapter.region}</div>
                  </td>
                  <td className="p-4 font-semibold">{chapter.activeMembers}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold ${chapter.performance?.attendancePct && chapter.performance.attendancePct >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {chapter.performance?.attendancePct}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{chapter.performance?.visitorConversionPct}%</td>
                  <td className="p-4 font-semibold">{chapter.performance?.referrals}</td>
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(chapter.performance?.closedBusiness || 0)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      chapter.performance?.paymentStatus === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {chapter.performance?.paymentStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
