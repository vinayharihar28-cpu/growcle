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

export interface AdminDirector extends AdminMember {
  assignedChapters: { id: string; name: string }[];
  lastActivity: string;
}

export interface LeadershipAssignment {
  chapterId: string;
  chapterName: string;
  president?: { id: string; name: string; email: string };
  vicePresident?: { id: string; name: string; email: string };
  treasurer?: { id: string; name: string; email: string };
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
  code: string;
  organizationId: string;
  region: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  meetingType: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  directorId?: string;
  directorName?: string;
  presidentName: string;
  vicePresidentName: string;
  secretaryName: string; // also Treasurer
  memberCount: number;
  activeMembers: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
  upcomingMeeting?: string;
  // Performance Analytics summary for table
  performance?: {
    attendancePct: number;
    visitors: number;
    visitorConversionPct: number;
    referrals: number;
    closedBusiness: number;
    paymentStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
  };
}

export interface AdminStats {
  chapters: {
    total: number;
    active: number;
    inactive: number;
  };
  members: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
  visitors: {
    total: number;
    upcoming: number;
    attended: number;
    converted: number;
  };
  referrals: {
    total: number;
    pending: number;
    contacted: number;
    closedWon: number;
    closedLost: number;
    totalClosedBusiness: number; // Value of closed won
  };
  payments: {
    totalCollected: number;
    pending: number;
    outstanding: number;
  };
}
