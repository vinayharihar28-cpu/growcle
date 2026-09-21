'use client';

import { useState, useEffect } from 'react';
import { getAdminAttendanceData, correctAttendanceRecord } from '../actions/admin-actions';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { AttendanceStatus } from '@prisma/client';
import { 
  Contact, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  AlertCircle, 
  Edit3, 
  Building2,
  Search,
  Filter
} from 'lucide-react';

export function AttendanceManagementView() {
  const [data, setData] = useState<{
    chapters: { id: string; name: string }[];
    selectedChapterId: string;
    meetings: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('PRESENT');
  const [saving, setSaving] = useState(false);
  const [searchMember, setSearchMember] = useState('');

  const loadData = async (chapterId?: string) => {
    setLoading(true);
    const res = await getAdminAttendanceData(chapterId);
    setData(res);
    setSelectedChapter(res.selectedChapterId);
    if (res.meetings.length > 0) {
      setSelectedMeetingId(res.meetings[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChapterChange = (id: string) => {
    setSelectedChapter(id);
    loadData(id);
  };

  const handleStatusUpdate = async () => {
    if (!editingRecord) return;
    setSaving(true);
    await correctAttendanceRecord(editingRecord.id, newStatus);
    await loadData(selectedChapter);
    setSaving(false);
    setEditingRecord(null);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const activeMeeting = data.meetings.find((m) => m.id === selectedMeetingId) || data.meetings[0];
  const records = activeMeeting?.records || [];
  const filteredRecords = records.filter((r: any) => 
    r.memberName.toLowerCase().includes(searchMember.toLowerCase()) ||
    r.email.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Contact className="w-6 h-6 text-indigo-500" /> Attendance Tracking & Corrections
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform oversight of weekly meeting attendance, member reliability, and record adjustments.
          </p>
        </div>

        {/* Chapter Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedChapter}
            onChange={(e) => handleChapterChange(e.target.value)}
            className="px-3 py-2 border rounded-xl bg-card text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
          >
            {data.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meeting Picker Tabs */}
      {data.meetings.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
          <span className="text-xs font-semibold text-muted-foreground uppercase mr-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Meeting:
          </span>
          {data.meetings.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMeetingId(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMeetingId === m.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {m.title}
            </button>
          ))}
        </div>
      )}

      {/* Summary KPI Cards */}
      {activeMeeting && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl border bg-card shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">Total Members</span>
            <div className="text-2xl font-extrabold mt-1">{activeMeeting.totalMembers}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">Present</span>
            <div className="text-2xl font-extrabold mt-1 text-emerald-600">{activeMeeting.present}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">Substitute</span>
            <div className="text-2xl font-extrabold mt-1 text-blue-600">{activeMeeting.substitute}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">Absent</span>
            <div className="text-2xl font-extrabold mt-1 text-rose-600">{activeMeeting.absent}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">Excused</span>
            <div className="text-2xl font-extrabold mt-1 text-amber-600">{activeMeeting.excused}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-xs bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Attendance Rate</span>
            <div className="text-2xl font-extrabold mt-1 text-indigo-600 dark:text-indigo-400">{activeMeeting.rate}%</div>
          </div>
        </div>
      )}

      {/* Roster & Attendance Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search member in this meeting..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3.5">Member Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No attendance records found for this meeting.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {r.memberName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {r.email}
                    </td>
                    <td className="px-6 py-4">
                      {r.status === 'PRESENT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Present
                        </span>
                      )}
                      {r.status === 'SUBSTITUTE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          <UserCheck className="w-3 h-3" /> Substitute
                        </span>
                      )}
                      {r.status === 'ABSENT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Absent
                        </span>
                      )}
                      {r.status === 'EXCUSED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <AlertCircle className="w-3 h-3" /> Excused
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingRecord(r);
                          setNewStatus(r.status);
                        }}
                        className="h-8 px-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Correct Status
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Correction Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Correct Attendance Record</h3>
            <p className="text-xs text-muted-foreground">
              Adjust attendance record for <strong>{editingRecord.memberName}</strong>. This change will be logged in platform audit logs.
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-foreground">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                className="w-full px-3 py-2 border rounded-xl bg-background text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="PRESENT">Present (Attended)</option>
                <option value="SUBSTITUTE">Substitute (Sent representative)</option>
                <option value="ABSENT">Absent (Unexcused)</option>
                <option value="EXCUSED">Excused (Prior notice)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRecord(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleStatusUpdate}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {saving ? 'Updating...' : 'Save Correction'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
