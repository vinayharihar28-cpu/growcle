import { AdminMeeting, AttendanceRecord } from '@/types/admin';
import { MOCK_MEETINGS, MOCK_ATTENDANCE } from '../mock-store';

/**
 * MeetingRepository
 * Abstracted async data repository for chapter meetings & attendance tracking.
 */
export class MeetingRepository {
  private static meetings: AdminMeeting[] = [...MOCK_MEETINGS];
  private static attendance: AttendanceRecord[] = [...MOCK_ATTENDANCE];

  static async findAll(chapterId?: string): Promise<AdminMeeting[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (chapterId) {
      return this.meetings.filter((m) => m.chapterId === chapterId);
    }
    return [...this.meetings];
  }

  static async findById(id: string): Promise<AdminMeeting | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.meetings.find((m) => m.id === id) || null;
  }

  static async create(data: Omit<AdminMeeting, 'id' | 'status' | 'presentCount' | 'absentCount' | 'visitorCount'>): Promise<AdminMeeting> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const newMeeting: AdminMeeting = {
      ...data,
      id: `meet-${Date.now()}`,
      status: 'SCHEDULED',
      presentCount: 0,
      absentCount: 0,
      visitorCount: 0,
    };

    this.meetings.unshift(newMeeting);
    return newMeeting;
  }

  static async updateStatus(id: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'): Promise<AdminMeeting> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const meeting = this.meetings.find((m) => m.id === id);
    if (!meeting) throw new Error('Meeting not found');

    meeting.status = status;
    return { ...meeting };
  }

  static async findAttendanceByMeeting(meetingId: string): Promise<AttendanceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.attendance.filter((a) => a.meetingId === meetingId);
  }

  static async recordAttendance(meetingId: string, records: AttendanceRecord[]): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Remove previous records for this meeting and insert new ones
    this.attendance = this.attendance.filter((a) => a.meetingId !== meetingId);
    this.attendance.push(...records);

    // Recalculate meeting summary counts
    const meeting = this.meetings.find((m) => m.id === meetingId);
    if (meeting) {
      meeting.presentCount = records.filter((r) => r.status === 'PRESENT' && r.type === 'MEMBER').length;
      meeting.absentCount = records.filter((r) => r.status === 'ABSENT' && r.type === 'MEMBER').length;
      meeting.visitorCount = records.filter((r) => r.type === 'VISITOR').length;
    }

    return true;
  }
}
