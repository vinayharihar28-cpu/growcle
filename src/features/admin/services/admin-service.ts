import { MemberRepository } from '@/lib/mock/repositories/member-repository';
import { MeetingRepository } from '@/lib/mock/repositories/meeting-repository';
import { AdminMember, AdminMeeting, AttendanceRecord, AdminStats } from '@/types/admin';

export class AdminService {
  static async getMembers(query?: { search?: string; chapterId?: string; roleCode?: string }): Promise<AdminMember[]> {
    return MemberRepository.findAll(query);
  }

  static async createMember(data: Omit<AdminMember, 'id' | 'joinedDate' | 'status'>): Promise<AdminMember> {
    return MemberRepository.create(data);
  }

  static async updateMember(id: string, updates: Partial<AdminMember>): Promise<AdminMember> {
    return MemberRepository.update(id, updates);
  }

  static async deleteMember(id: string): Promise<boolean> {
    return MemberRepository.delete(id);
  }

  static async getMeetings(chapterId?: string): Promise<AdminMeeting[]> {
    return MeetingRepository.findAll(chapterId);
  }

  static async createMeeting(data: Omit<AdminMeeting, 'id' | 'status' | 'presentCount' | 'absentCount' | 'visitorCount'>): Promise<AdminMeeting> {
    return MeetingRepository.create(data);
  }

  static async updateMeetingStatus(id: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'): Promise<AdminMeeting> {
    return MeetingRepository.updateStatus(id, status);
  }

  static async getAttendanceByMeeting(meetingId: string): Promise<AttendanceRecord[]> {
    return MeetingRepository.findAttendanceByMeeting(meetingId);
  }

  static async recordAttendance(meetingId: string, records: AttendanceRecord[]): Promise<boolean> {
    return MeetingRepository.recordAttendance(meetingId, records);
  }

  static async getAdminStats(): Promise<AdminStats> {
    return MemberRepository.getStats();
  }
}
