'use client';

import { useState, useEffect } from 'react';
import { getAdminAuditLogsList } from '../actions/admin-actions';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal,
  User,
  Clock
} from 'lucide-react';

export function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const loadLogs = async (actionFilter?: string) => {
    setLoading(true);
    const res = await getAdminAuditLogsList(actionFilter);
    setLogs(res);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs(selectedAction);
  }, [selectedAction]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const filteredLogs = logs.filter((l) =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase()) ||
    l.ipAddress.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" /> Platform Security & Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Immutable records of administrative operations, role modifications, chapter actions, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted border text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Tamper-Evident Audit Trail
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by actor, action, entity, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border rounded-xl bg-card text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border rounded-xl bg-card text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
          >
            <option value="ALL">All Event Actions</option>
            <option value="CREATE_CHAPTER">CREATE_CHAPTER</option>
            <option value="ASSIGN_DIRECTOR">ASSIGN_DIRECTOR</option>
            <option value="UPDATE_LEADERSHIP_ROLE">UPDATE_LEADERSHIP_ROLE</option>
            <option value="CORRECT_ATTENDANCE">CORRECT_ATTENDANCE</option>
            <option value="RECORD_MANUAL_PAYMENT">RECORD_MANUAL_PAYMENT</option>
            <option value="BROADCAST_NOTIFICATION">BROADCAST_NOTIFICATION</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Actor</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Target Entity</th>
                <th className="px-6 py-3.5">Entity ID</th>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-sans">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 font-sans font-semibold text-foreground">
                      {l.actor}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground font-sans">
                      {l.entity}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {l.entityId}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {l.ipAddress}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-sans font-semibold text-xs">
                        <CheckCircle2 className="w-3 h-3" /> Success
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
