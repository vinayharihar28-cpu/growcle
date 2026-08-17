'use client';

import { useState } from 'react';
import { useAdmin } from '../hooks/use-admin';
import {
  Users,
  Building2,
  TrendingUp,
  CreditCard,
  UserPlus,
  Handshake,
  DollarSign,
  Briefcase,
  Plus,
  Calendar,
  Bell,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { AdminAnalytics } from '../components/admin-analytics';

export default function AdminWorkspacePage() {
  const { stats, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  if (loading || !stats) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { label: 'Create Chapter', icon: Building2, href: '/dashboard/chapters?create=true', color: 'bg-indigo-500/10 text-indigo-600' },
    { label: 'Add Member', icon: UserPlus, href: '/dashboard/members', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Add Visitor', icon: Users, href: '/dashboard/visitors', color: 'bg-amber-500/10 text-amber-600' },
    { label: 'Create Meeting', icon: Calendar, href: '/dashboard/meetings', color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Record Payment', icon: CreditCard, href: '/dashboard/payments', color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Send Notification', icon: Bell, href: '/dashboard/notifications', color: 'bg-rose-500/10 text-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-2">
            High-level platform metrics covering chapters, membership, activity, and financials.
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Deep Analytics
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chapters KPI */}
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Chapters</p>
                  <h2 className="text-3xl font-extrabold">{stats.chapters.total}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground">Active:</span> <span className="font-semibold text-emerald-600">{stats.chapters.active}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Inactive:</span> <span className="font-semibold text-rose-600">{stats.chapters.inactive}</span>
                </div>
              </div>
            </div>

            {/* Members KPI */}
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <h2 className="text-3xl font-extrabold">{stats.members.total}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm pt-4 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground">Active:</span> <span className="font-semibold text-emerald-600">{stats.members.active}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pending:</span> <span className="font-semibold text-amber-600">{stats.members.pending}</span>
                </div>
              </div>
            </div>

            {/* Visitors KPI */}
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                  <h2 className="text-3xl font-extrabold">{stats.visitors.total}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm pt-4 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground">Attended:</span> <span className="font-semibold">{stats.visitors.attended}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Converted:</span> <span className="font-semibold text-emerald-600">{stats.visitors.converted}</span>
                </div>
              </div>
            </div>

            {/* Referrals KPI */}
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <Handshake className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <h2 className="text-3xl font-extrabold">{stats.referrals.total}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm pt-4 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground">Won:</span> <span className="font-semibold text-emerald-600">{stats.referrals.closedWon}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Contacted:</span> <span className="font-semibold text-blue-600">{stats.referrals.contacted}</span>
                </div>
              </div>
            </div>

            {/* Closed Business KPI */}
            <div className="p-6 rounded-2xl border bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-200">Closed Business</p>
                  <h2 className="text-4xl font-extrabold mt-1">{formatCurrency(stats.referrals.totalClosedBusiness)}</h2>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Generated from closed won</span>
              </div>
            </div>

            {/* Payments KPI */}
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                  <h2 className="text-3xl font-extrabold">{formatCurrency(stats.payments.totalCollected)}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm pt-4 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground">Pending:</span> <span className="font-semibold text-amber-600">{formatCurrency(stats.payments.pending)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Outstanding:</span> <span className="font-semibold text-rose-600">{formatCurrency(stats.payments.outstanding)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="pt-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <div className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors flex flex-col items-center justify-center text-center gap-3 cursor-pointer h-full shadow-xs">
                    <div className={`p-2.5 rounded-full ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && <AdminAnalytics stats={stats} />}
    </div>
  );
}
