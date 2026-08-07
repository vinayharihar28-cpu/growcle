'use client';

import { Users, Calendar, UserCheck, ShieldCheck, Activity, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export function ChapterAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Chapter Executives Console</h2>
          <p className="text-xs text-slate-300">
            Silicon Valley Founders • Manage member rosters, schedules, and log attendance metrics.
          </p>
        </div>
        <Link
          href="/dashboard/meetings"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Open Attendance Sheet
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Roster Count
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 Members</div>
            <p className="text-[10px] text-muted-foreground mt-1">2 Pending Inductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Weekly Attendance
            </CardTitle>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.4%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Top Chapter Rank</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Scheduled Meetings
            </CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Scheduled</div>
            <p className="text-[10px] text-blue-600 font-semibold mt-1">Next: Thursday 7:30 AM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Chapter Health
            </CardTitle>
            <Activity className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Outstanding</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Tier-1 Chapter Status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Active Chapter Executives</CardTitle>
          </CardHeader>
          <CardContent className="divide-y text-xs">
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="font-bold text-foreground">Marcus Vance</span>
                <p className="text-[10px] text-muted-foreground">President</p>
              </div>
              <span className="font-medium text-slate-500">Silicon Valley Founders</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="font-bold text-foreground">Sophia Rodriguez</span>
                <p className="text-[10px] text-muted-foreground">Vice President</p>
              </div>
              <span className="font-medium text-slate-500">Silicon Valley Founders</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Recent Chapter Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 border rounded-xl bg-accent/40 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h6 className="font-bold text-foreground">Induction Master Milestone</h6>
                <p className="text-[11px] text-muted-foreground mt-0.5">Inducted 5 new members in under 30 days.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
