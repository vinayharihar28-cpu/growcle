import { PermissionKey } from './rbac';

export interface AdminMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  businessName?: string;
  industry?: string;
  chapterId?: string;
  chapterName?: string;
  roleCode: string;
  roleName: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedDate: string;
}

export interface AdminMeeting {
  id: string;
  chapterId: string;
  chapterName: string;
  date: string;
  time: string;
  location?: string;
  meetingLink?: string;
  agenda?: string;
  meetingType: 'REGULAR_WEEKLY' | 'BOARD_MEETING' | 'SPECIAL_EVENT';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  presentCount: number;
  absentCount: number;
  visitorCount: number;
}

export interface AttendanceRecord {
  id: string;
  meetingId: string;
  memberId?: string;
  visitorId?: string;
  name: string;
  email: string;
  type: 'MEMBER' | 'VISITOR';
  status: 'PRESENT' | 'ABSENT' | 'SUBSTITUTE' | 'EXCUSED';
  notes?: string;
}

export interface ChapterDetails {
  id: string;
  name: string;
  organizationId: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  presidentName: string;
  vicePresidentName: string;
  secretaryName: string;
  memberCount: number;
}

export interface AdminStats {
  totalMembers: number;
  activeChapters: number;
  scheduledMeetings: number;
  averageAttendancePct: number;
  pendingInvites: number;
}
