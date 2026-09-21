'use client';

import { useState, useEffect } from 'react';
import { getAdminNotificationsList, broadcastAdminNotification } from '../actions/admin-actions';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { 
  Bell, 
  Send, 
  Search, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Radio,
  Plus
} from 'lucide-react';

export function NotificationsManagementView() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('ALL_MEMBERS');
  const [priority, setPriority] = useState('NORMAL');

  const loadNotifications = async () => {
    setLoading(true);
    const res = await getAdminNotificationsList();
    setNotifications(res);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setBroadcasting(true);
    await broadcastAdminNotification({
      title,
      message,
      recipientType,
      priority,
    });
    await loadNotifications();
    setBroadcasting(false);
    setIsModalOpen(false);
    setTitle('');
    setMessage('');
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const filtered = notifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase()) ||
    n.recipient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" /> Platform Notification Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Broadcast emergency alerts, dues reminders, and platform announcements to members and leadership.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            <Send className="w-4 h-4 mr-1.5" /> Broadcast Announcement
          </Button>
        </div>
      </div>

      {/* Broadcast History & List */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No notifications broadcast yet.
            </div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className="p-5 hover:bg-muted/30 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                      <Megaphone className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-foreground text-base">{n.title}</h3>
                    {n.priority === 'HIGH' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  {n.message}
                </p>

                <div className="pl-8 pt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Audience: <strong className="text-foreground">{n.recipient}</strong></span>
                  <span>Type: <strong className="text-foreground">{n.type}</strong></span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-500" /> Send Platform Notification
            </h3>
            <p className="text-xs text-muted-foreground">
              This will send in-app and push alerts to all users matching the target criteria.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter Leadership Meeting Rescheduled"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Target Audience</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                >
                  <option value="ALL_MEMBERS">All Chapter Members (Platform-wide)</option>
                  <option value="DIRECTORS">Regional Directors Only</option>
                  <option value="LEADERSHIP">Chapter Presidents, VPs & Treasurers</option>
                  <option value="BILLING">Members with Overdue Payments</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                >
                  <option value="NORMAL">Normal (Standard in-app badge)</option>
                  <option value="HIGH">High (Immediate push alert)</option>
                  <option value="URGENT">Urgent (Modal alert on next login)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full notification details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={broadcasting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={broadcasting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {broadcasting ? 'Sending...' : 'Broadcast Now'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
