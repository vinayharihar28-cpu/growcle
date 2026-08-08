'use client';

import { Activity, ShieldAlert, Cpu, HardDrive, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function PlatformAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-slate-900 text-white space-y-2 shadow-md">
        <h2 className="text-xl font-bold">Platform Super-Admin Workspace</h2>
        <p className="text-xs text-slate-300">
          Global SaaS environment overview. Check container metrics, subscription states, system performance, and active tenants.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total tenants
            </CardTitle>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Active</div>
            <p className="text-[10px] text-muted-foreground mt-1">Multi-tenant isolation active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              CPU Utilization
            </CardTitle>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Healthy cluster nodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Memory Usage
            </CardTitle>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2 / 16 GB</div>
            <p className="text-[10px] text-muted-foreground mt-1">Database cache optimal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Audit Logs status
            </CardTitle>
            <RefreshCw className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100% Ok</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Logs streaming online</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
