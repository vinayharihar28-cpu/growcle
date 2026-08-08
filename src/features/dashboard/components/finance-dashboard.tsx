'use client';

import { DollarSign, FileText, ArrowUpRight, TrendingUp, HelpCircle, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-slate-900 text-white space-y-2 shadow-md">
        <h2 className="text-xl font-bold">Revenue & Billing Workspace</h2>
        <p className="text-xs text-slate-300">
          Track membership dues, generate invoices, record incoming payments, and review outstanding accounts.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,500</div>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14% this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Outstanding Dues
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-[10px] text-muted-foreground mt-1">4 Unpaid Member Accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dues Paid (Q3)
            </CardTitle>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Highly compliant roster</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Pending Dues & Invoices</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="font-bold text-foreground">Marcus Vance</span>
                <p className="text-[10px] text-muted-foreground">Silicon Valley Founders</p>
              </div>
              <span className="font-bold text-rose-500">$350 Dues (Pending)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="font-bold text-foreground">Elena Rostova</span>
                <p className="text-[10px] text-muted-foreground">Metro Executive Network</p>
              </div>
              <span className="font-bold text-rose-500">$350 Dues (Pending)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
