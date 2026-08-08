'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, Calendar, MapPin, Video, FileText } from 'lucide-react';
import { AdminMeeting } from '@/types/admin';

interface ManageMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AdminMeeting, 'id' | 'status' | 'presentCount' | 'absentCount' | 'visitorCount'>) => Promise<unknown>;
}

export function ManageMeetingModal({ isOpen, onClose, onSubmit }: ManageMeetingModalProps) {
  const [formData, setFormData] = useState({
    chapterId: 'chap-01',
    chapterName: 'Silicon Valley Founders',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 AM',
    location: 'Innovation Hub, Floor 4, Palo Alto CA',
    meetingLink: 'https://zoom.us/j/987654321',
    agenda: 'Weekly Networking & Business Presentation',
    meetingType: 'REGULAR_WEEKLY' as const,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 overflow-hidden relative">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Schedule Chapter Meeting</h3>
              <p className="text-xs text-muted-foreground">Set meeting date, location, agenda, and notification options</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Chapter</label>
              <select
                value={formData.chapterId}
                onChange={(e) => {
                  const name = e.target.value === 'chap-01' ? 'Silicon Valley Founders' : 'Metro Executive Network';
                  setFormData({ ...formData, chapterId: e.target.value, chapterName: name });
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="chap-01">Silicon Valley Founders</option>
                <option value="chap-02">Metro Executive Network</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Meeting Type</label>
              <select
                value={formData.meetingType}
                onChange={(e) => setFormData({ ...formData, meetingType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="REGULAR_WEEKLY">Regular Weekly Meeting</option>
                <option value="BOARD_MEETING">Board / Officer Meeting</option>
                <option value="SPECIAL_EVENT">Special Event / Visitor Day</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Meeting Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Start Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 07:30 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Physical Location / Venue
            </label>
            <input
              type="text"
              placeholder="e.g. Innovation Hub, Palo Alto CA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-muted-foreground" /> Virtual Video Link (Zoom / Teams / Meet)
            </label>
            <input
              type="url"
              placeholder="https://zoom.us/j/123456789"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Meeting Agenda & Topics
            </label>
            <textarea
              rows={3}
              placeholder="Outline the meeting presentation, feature speaker, and referral goals..."
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {submitting ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
