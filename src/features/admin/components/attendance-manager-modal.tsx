'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, CheckCircle2, XCircle, UserCheck, ShieldAlert } from 'lucide-react';
import { AdminMeeting, AttendanceRecord } from '@/types/admin';
import { AdminService } from '../services/admin-service';
import { cn } from '@/lib/utils';

interface AttendanceManagerModalProps {
  meeting: AdminMeeting | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function AttendanceManagerModal({ meeting, isOpen, onClose, onSaved }: AttendanceManagerModalProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (meeting && isOpen) {
      setLoading(true);
      AdminService.getAttendanceByMeeting(meeting.id)
        .then((data) => setRecords(data))
        .finally(() => setLoading(false));
    }
  }, [meeting, isOpen]);

  if (!isOpen || !meeting) return null;

  const handleStatusChange = (id: string, status: AttendanceRecord['status']) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, notes } : r)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AdminService.recordAttendance(meeting.id, records);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const totalCount = records.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 overflow-hidden relative">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Attendance Sheet: {meeting.chapterName}</h3>
              <p className="text-xs text-muted-foreground">Meeting Date: {meeting.date} at {meeting.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Registered</span>
            <span className="font-bold text-foreground text-sm">{totalCount} Attendees</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Present Today</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{presentCount} Present</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Attendance Rate</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{attendanceRate}%</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading attendance sheet...</div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border bg-background hover:bg-accent/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-xs shrink-0">
                    {rec.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{rec.name}</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.5 text-[9px] font-bold rounded-full border',
                          rec.type === 'MEMBER'
                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        )}
                      >
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{rec.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={rec.status}
                    onChange={(e) => handleStatusChange(rec.id, e.target.value as any)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg border text-xs font-semibold outline-hidden cursor-pointer',
                      rec.status === 'PRESENT' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
                      rec.status === 'ABSENT' && 'bg-rose-500/10 text-rose-600 border-rose-500/30',
                      rec.status === 'SUBSTITUTE' && 'bg-sky-500/10 text-sky-600 border-sky-500/30',
                      rec.status === 'EXCUSED' && 'bg-slate-500/10 text-slate-600 border-slate-500/30'
                    )}
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="SUBSTITUTE">SUBSTITUTE</option>
                    <option value="EXCUSED">EXCUSED</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Notes..."
                    value={rec.notes || ''}
                    onChange={(e) => handleNotesChange(rec.id, e.target.value)}
                    className="w-32 px-2 py-1 rounded-lg border bg-background text-[11px] outline-hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {saving ? 'Saving Sheet...' : 'Save & Publish Attendance'}
          </Button>
        </div>
      </div>
    </div>
  );
}
