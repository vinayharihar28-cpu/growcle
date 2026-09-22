import { AdminMember, AdminMeeting, AttendanceRecord, AdminStats, ChapterDetails, AdminDirector, LeadershipAssignment } from '@/types/admin';

export class AdminService {
  static async getMembers(query?: { search?: string; chapterId?: string; roleCode?: string }): Promise<AdminMember[]> {
    try {
      const { getMembers } = await import('@/features/members/actions/members');
      const members = await getMembers();
      let filtered = (members || []).map((m: any) => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phoneNumber: m.phoneNumber || undefined,
        businessName: m.business?.name || m.businessName || undefined,
        industry: m.business?.industry || m.industry || undefined,
        chapterId: m.chapterId || undefined,
        chapterName: m.chapter?.name || undefined,
        roleCode: m.roles?.[0]?.role?.name || 'MEMBER',
        roleName: m.roles?.[0]?.role?.name || 'Member',
        status: m.status as any,
        joinedDate: m.joinedAt ? new Date(m.joinedAt).toISOString() : new Date().toISOString(),
      }));

      if (query?.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.firstName.toLowerCase().includes(s) ||
            m.lastName.toLowerCase().includes(s) ||
            m.email.toLowerCase().includes(s) ||
            m.businessName?.toLowerCase().includes(s) ||
            m.industry?.toLowerCase().includes(s)
        );
      }

      if (query?.chapterId) {
        filtered = filtered.filter((m) => m.chapterId === query.chapterId);
      }

      return filtered;
    } catch {
      return [];
    }
  }

  static async createMember(data: Omit<AdminMember, 'id' | 'joinedDate' | 'status'>): Promise<AdminMember> {
    return {
      id: `mem-${Date.now()}`,
      ...data,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString(),
    };
  }

  static async updateMember(id: string, updates: Partial<AdminMember>): Promise<AdminMember> {
    return {
      id,
      firstName: '',
      lastName: '',
      email: '',
      roleCode: 'MEMBER',
      roleName: 'Member',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString(),
      ...updates,
    };
  }

  static async deleteMember(id: string): Promise<boolean> {
    return true;
  }

  static async getMeetings(chapterId?: string): Promise<AdminMeeting[]> {
    try {
      const { getMeetings } = await import('@/features/meetings/actions/meetings');
      const data = await getMeetings(chapterId || "all");
      return (data || []).map((m: any) => ({
        id: m.id,
        chapterId: m.chapterId || '',
        chapterName: m.chapter?.name || m.chapterName || 'Chapter',
        title: m.theme || m.title || 'Chapter Meeting',
        date: m.date ? new Date(m.date).toISOString().split('T')[0] : '',
        time: m.startTime || m.time || '07:00 AM',
        location: m.venue || m.location || 'Hybrid Meeting Room',
        meetingType: (m.type as any) || 'REGULAR_WEEKLY',
        status: (m.status as any) || 'SCHEDULED',
        presentCount: 0,
        absentCount: 0,
        visitorCount: 0,
      }));
    } catch {
      return [];
    }
  }

  static async createMeeting(data: Omit<AdminMeeting, 'id' | 'status' | 'presentCount' | 'absentCount' | 'visitorCount'>): Promise<AdminMeeting> {
    const { createMeeting } = await import('@/features/meetings/actions/meetings');
    const created = await createMeeting({
      chapterId: data.chapterId || 'temp-chapter-id',
      theme: data.title || 'Weekly Chapter Meeting',
      date: new Date(data.date),
      startTime: data.time,
      venue: data.location,
      status: 'SCHEDULED',
    });
    return {
      id: created.id,
      ...data,
      status: 'SCHEDULED',
      presentCount: 0,
      absentCount: 0,
      visitorCount: 0,
    };
  }

  static async updateMeetingStatus(id: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'): Promise<AdminMeeting | null> {
    return null;
  }

  static async getAttendanceByMeeting(meetingId: string): Promise<AttendanceRecord[]> {
    return [];
  }

  static async recordAttendance(meetingId: string, records: AttendanceRecord[]): Promise<boolean> {
    return true;
  }

  static async getAdminStats(chapterId?: string): Promise<AdminStats> {
    const { getAdminPlatformKPIs } = await import('../actions/admin-actions');
    const realKpis = await getAdminPlatformKPIs(chapterId);
    return realKpis as any;
  }

  static async getChapters(): Promise<ChapterDetails[]> {
    const { getAdminChaptersList } = await import('../actions/admin-actions');
    const chapters = await getAdminChaptersList();
    return chapters.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.chapterCode,
      organizationId: "org-1",
      region: c.region,
      meetingDay: c.meetingDay,
      meetingTime: c.meetingTime,
      location: c.location,
      meetingType: "HYBRID",
      meetingFee: (c as any).meetingFee ?? 800,
      themeColor: (c as any).themeColor ?? "emerald",
      upiId: (c as any).upiId ?? "",
      upiName: (c as any).upiName ?? "",
      directorName: c.directorName,
      presidentName: c.presidentName,
      vicePresidentName: c.vpName,
      secretaryName: c.treasurerName,
      memberCount: c.totalMembersCount,
      activeMembers: c.activeMembersCount,
      status: c.isActive ? "ACTIVE" : "INACTIVE",
      createdDate: new Date().toISOString(),
      upcomingMeeting: c.nextMeeting,
      performance: {
        attendancePct: c.attendanceRate,
        visitors: c.visitorCount,
        visitorConversionPct: c.visitorConversionRate,
        referrals: 0,
        closedBusiness: c.closedBusiness,
        paymentStatus: "HEALTHY",
      },
    }));
  }

  static async getDirectors(): Promise<AdminDirector[]> {
    const { getAdminDirectors } = await import('../actions/admin-actions');
    const directors = await getAdminDirectors();
    return directors.map((d: any) => ({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      roleCode: "DIRECTOR",
      roleName: "Regional Director",
      status: d.status || "ACTIVE",
      joinedDate: d.dateAssigned || new Date().toISOString(),
      assignedChapters: (d.assignedChapters || []).map((name: string, i: number) => ({ id: `ch-${i}`, name })),
      lastActivity: d.lastActivity || "Active",
    }));
  }

  static async getLeadership(): Promise<LeadershipAssignment[]> {
    const { getAdminLeadershipAssignments } = await import('../actions/admin-actions');
    const leadership = await getAdminLeadershipAssignments();
    return leadership as any;
  }
}
