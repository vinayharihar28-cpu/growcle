'use client';

import { Building, Users, Calendar, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function OrgAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-slate-900 text-white space-y-2 shadow-md">
        <h2 className="text-xl font-bold">Organization Administration Console</h2>
        <p className="text-xs text-slate-300">
          Manage local chapters, active rosters, custom domain structures, and check total revenue generated.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Chapters
            </CardTitle>
            <Building className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Chapters</div>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +1 chapter this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Members
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">286 Members</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across 8 regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Revenue Generated
            </CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,500</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">98.2% dues paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Chapter Score
            </CardTitle>
            <Activity className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">High engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Chapter Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <div className="py-2.5 flex justify-between">
              <span className="font-bold text-foreground">Silicon Valley Founders</span>
              <span className="font-bold text-emerald-600">96.4% Attendance</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-bold text-foreground">Metro Executive Network</span>
              <span className="font-bold text-emerald-600">91.8% Attendance</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
