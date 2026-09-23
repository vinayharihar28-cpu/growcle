"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  MemberStatus,
  VisitorStatus,
  ReferralStatus,
  MeetingStatus,
  AttendanceStatus,
} from "@prisma/client";

import { getCurrentSession } from "@/lib/auth/session";
import { validateMemberEmail, provisionMemberAuthAccount } from "@/lib/auth/member-auth-sync";

export interface LeadershipContext {
  chapterId: string;
  chapterName: string;
  chapterCode: string;
  location: string;
  meetingDay: string;
  meetingDayOfWeek: number;
  meetingTime: string;
  meetingFee: number;
  themeColor: string;
  upiId: string;
  upiName: string;
  position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  memberName: string;
  memberId: string;
}

export interface LeadershipKPIs {
  totalStrength: number;
  activeMembers: number;
  newMembers: number;
  inactiveMembers: number;
  upcomingVisitors: number;
  nextMeetingVisitors: number;
  attendancePercentage: number;
  attendanceTrend: number;
  totalReferrals: number;
  pendingReferrals: number;
  closedReferrals: number;
  closedBusiness: number;
  completedOneToOnes: number;
  scheduledOneToOnes: number;
  totalMeetingsCount: number;
  totalFeeRealization: number;
}

export interface UpcomingMeetingSummary {
  id: string;
  title: string;
  date: string;
  rawDate: string;
  time: string;
  location: string;
  meetingType: string;
  membersExpected: number;
  visitorsExpected: number;
  speaker: string;
  theme: string;
  agenda: string;
  turnoutPercentage?: number;
  feeRealization?: number;
  isTimeLocked?: boolean;
}

/**
 * Resolves current chapter scope and leadership identity.
 * Respects active-chapter-id cookie set by Chapter Theme / Switcher,
 * and falls back to authenticated session member's chapter assignment.
 */
export async function getLeadershipContext(): Promise<LeadershipContext> {
  const cookieStore = await cookies();
  const activeChapterIdCookie = cookieStore.get("active-chapter-id")?.value;
  const session = await getCurrentSession();

  let chapter = null;
  if (activeChapterIdCookie) {
    chapter = await db.chapter.findUnique({
      where: { id: activeChapterIdCookie },
      include: {
        members: {
          include: {
            roles: {
              include: { role: true },
            },
          },
        },
      },
    });
  }

  // If no chapter from cookie, resolve the authenticated user's assigned chapter
  if (!chapter && session?.user) {
    const userMember = await db.member.findFirst({
      where: {
        OR: [{ userId: session.user.id }, { email: session.user.email }],
      },
    });

    if (userMember?.chapterId) {
      chapter = await db.chapter.findUnique({
        where: { id: userMember.chapterId },
        include: {
          members: {
            include: {
              roles: {
                include: { role: true },
              },
            },
          },
        },
      });
    }
  }

  if (!chapter) {
    chapter = await db.chapter.findFirst({
      include: {
        members: {
          include: {
            roles: {
              include: { role: true },
            },
          },
        },
      },
    });
  }

  if (!chapter) {
    return {
      chapterId: "default",
      chapterName: "Apex Chapter",
      chapterCode: "APX-01",
      location: "Innovation Business Center",
      meetingDay: "Wednesday",
      meetingDayOfWeek: 3,
      meetingTime: "07:30 AM",
      meetingFee: 800,
      themeColor: "emerald",
      upiId: "apexchapter@okaxis",
      upiName: "SSK Apex Chapter Treasury",
      position: "PRESIDENT",
      memberName: session?.user?.name || "Marcus Vance",
      memberId: "default-member",
    };
  }

  const president = chapter.members.find(
    (m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president")
  );

  let activeMember = president;
  let activePosition: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER" = "PRESIDENT";

  if (session?.user) {
    const sessionMember = chapter.members.find(
      (m) => m.userId === session.user.id || m.email === session.user.email
    );
    if (sessionMember) {
      activeMember = sessionMember;
      const rNames = sessionMember.roles.map((r) => r.role.name.toUpperCase());
      if (rNames.includes("VICE_PRESIDENT")) {
        activePosition = "VICE_PRESIDENT";
      } else if (rNames.includes("TREASURER")) {
        activePosition = "TREASURER";
      }
    }
  }

  return {
    chapterId: chapter.id,
    chapterName: chapter.name,
    chapterCode: chapter.chapterCode || `CHP-${chapter.id.substring(0, 4)}`,
    location: chapter.meetingLocation || "Business Suites Hall",
    meetingDay: chapter.meetingDay || "Wednesday",
    meetingDayOfWeek: (chapter as any).meetingDayOfWeek ?? 3,
    meetingTime: chapter.meetingTime || "07:30 AM",
    meetingFee: Number((chapter as any).meetingFee ?? 800),
    themeColor: (chapter as any).themeColor || "emerald",
    upiId: (chapter as any).upiId || "chapter@upi",
    upiName: (chapter as any).upiName || `${chapter.name} Chapter Treasury`,
    position: activePosition,
    memberName: activeMember ? `${activeMember.firstName} ${activeMember.lastName}` : (session?.user?.name || "Chapter Leader"),
    memberId: activeMember?.id || chapter.members[0]?.id || "",
  };
}

/**
 * Dashboard KPIs, meeting navigation carousel, and tabbed analytics suite.
 */
export async function getLeadershipDashboardData(chapterId: string) {
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: {
      members: {
        include: {
          business: true,
          roles: { include: { role: true } },
          givenReferrals: true,
        },
      },
      visitors: true,
      referrals: true,
      meetings: {
        include: {
          attendances: {
            include: { member: true },
          },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const activeMembers = chapter.members.filter((m) => m.status === MemberStatus.ACTIVE).length;
  const newMembers = chapter.members.filter(
    (m) => m.joinedAt && m.joinedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const inactiveMembers = chapter.members.filter((m) => m.status === MemberStatus.INACTIVE).length;
  const upcomingVisitors = chapter.visitors.filter((v) => v.status === VisitorStatus.PENDING).length;

  const totalStrength = activeMembers + upcomingVisitors;

  const closedWon = chapter.referrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const closedBusiness = closedWon.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  // Past meetings history with turnout % and collections for carousel
  const meetingHistory = chapter.meetings.map((m) => {
    const total = m.attendances.length;
    const present = m.attendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT || (a as any).paid === true
    ).length;
    const turnout = total > 0 ? Math.round((present / total) * 100) : 0;
    const feeRealization = m.attendances
      .filter((a) => (a as any).paid === true)
      .reduce((sum, a) => sum + (Number((a as any).amount) || Number((chapter as any).meetingFee ?? 800)), 0);

    const isFuture = new Date(m.date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);

    return {
      id: m.id,
      title: m.title || "Weekly Business Exchange",
      date: new Date(m.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      rawDate: m.date.toISOString(),
      turnoutPercentage: turnout,
      feeRealization,
      present,
      total,
      isTimeLocked: isFuture,
    };
  });

  // Next or current meeting
  const upcomingMeetingRaw =
    chapter.meetings.find((m) => new Date(m.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) ||
    chapter.meetings[chapter.meetings.length - 1];

  let upcomingMeetingSummary: UpcomingMeetingSummary | null = null;
  if (upcomingMeetingRaw) {
    const total = upcomingMeetingRaw.attendances.length;
    const present = upcomingMeetingRaw.attendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT || (a as any).paid === true
    ).length;
    const turnout = total > 0 ? Math.round((present / total) * 100) : 0;
    const isFuture = new Date(upcomingMeetingRaw.date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);

    upcomingMeetingSummary = {
      id: upcomingMeetingRaw.id,
      title: upcomingMeetingRaw.title || `${chapter.name} Weekly Exchange`,
      date: new Date(upcomingMeetingRaw.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rawDate: upcomingMeetingRaw.date.toISOString(),
      time: chapter.meetingTime || "07:30 AM",
      location: upcomingMeetingRaw.location || chapter.meetingLocation || "Main Executive Suites",
      meetingType: upcomingMeetingRaw.meetingType || "HYBRID",
      membersExpected: activeMembers,
      visitorsExpected: upcomingVisitors,
      speaker: upcomingMeetingRaw.speaker || "Featured Chapter Member",
      theme: upcomingMeetingRaw.theme || "Synergies & Strategic Partnerships",
      agenda:
        upcomingMeetingRaw.agenda ||
        "1. Welcome & Coffee\n2. President Address\n3. 45-Second Introductions\n4. Feature Presentation\n5. Referral Exchange\n6. Visitor Announcements",
      turnoutPercentage: turnout,
      feeRealization: present * Number((chapter as any).meetingFee ?? 800),
      isTimeLocked: isFuture,
    };
  }

  // Analytics Suite: Attendance Composition Trend (Stacked Members vs Visitors)
  const attendanceCompositionTrend = chapter.meetings.slice(-8).map((m) => {
    const memberCount = m.attendances.filter((a) => a.memberId).length;
    const visitorCount = m.attendances.filter((a) => (a as any).visitorId).length;
    return {
      date: new Date(m.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      members: memberCount,
      visitors: visitorCount,
      turnout: m.attendances.length > 0
        ? Math.round(
            (m.attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length /
              m.attendances.length) *
              100
          )
        : 0,
    };
  });

  // Analytics Suite: Weekly Revenue Realization Trend (Cash vs UPI vs Advance)
  const weeklyRevenueTrend = chapter.meetings.slice(-8).map((m) => {
    const upiPaid = m.attendances.filter((a) => (a as any).paid && (a as any).paymentMethod?.includes("UPI")).length;
    const cashPaid = m.attendances.filter((a) => (a as any).paid && (a as any).paymentMethod === "CASH").length;
    const fee = Number((chapter as any).meetingFee ?? 800);
    const upiAmount = upiPaid * fee;
    const cashAmount = cashPaid * fee;
    const advAmount = 0;

    return {
      date: new Date(m.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      upi: upiAmount,
      cash: cashAmount,
      advance: advAmount,
      total: upiAmount + cashAmount + advAmount,
    };
  });

  // Top Referrers Leaderboard
  const topReferrers = chapter.members
    .map((m) => ({
      name: `${m.firstName} ${m.lastName}`,
      count: m.givenReferrals.length,
      businessName: m.business?.businessName || "Member Firm",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Total collected across all meetings
  const totalFeeRealization = chapter.meetings.reduce((sum, m) => {
    return (
      sum +
      m.attendances
        .filter((a) => (a as any).paid === true)
        .reduce((aSum, a) => aSum + (Number((a as any).amount) || Number((chapter as any).meetingFee ?? 800)), 0)
    );
  }, 0);

  const avgAttendance = meetingHistory.length > 0
    ? Math.round(meetingHistory.reduce((acc, m) => acc + m.turnoutPercentage, 0) / meetingHistory.length)
    : 0;

  const kpis: LeadershipKPIs = {
    totalStrength,
    activeMembers,
    newMembers: newMembers,
    inactiveMembers,
    upcomingVisitors,
    nextMeetingVisitors: upcomingVisitors,
    attendancePercentage: avgAttendance,
    attendanceTrend: 0,
    totalReferrals: chapter.referrals.length,
    pendingReferrals: chapter.referrals.filter((r) => r.status === ReferralStatus.PENDING).length,
    closedReferrals: closedWon.length,
    closedBusiness,
    completedOneToOnes: 0,
    scheduledOneToOnes: 0,
    totalMeetingsCount: chapter.meetings.length,
    totalFeeRealization: totalFeeRealization,
  };

  return {
    kpis,
    upcomingMeeting: upcomingMeetingSummary,
    meetingHistory,
    attendanceCompositionTrend,
    weeklyRevenueTrend,
    topReferrers,
    chapter: {
      id: chapter.id,
      name: chapter.name,
      chapterCode: chapter.chapterCode,
      location: chapter.meetingLocation,
      meetingDay: chapter.meetingDay,
      meetingFee: Number((chapter as any).meetingFee ?? 800),
      themeColor: (chapter as any).themeColor || "emerald",
      upiId: (chapter as any).upiId || "chapter@upi",
      upiName: (chapter as any).upiName || `${chapter.name} Treasury`,
    },
  };
}

/**
 * Fetch chapter members with dynamic multi-field search and date-grouping.
 */
export async function getLeadershipMembers(chapterId: string, params?: { search?: string; status?: string }) {
  const whereClause: any = { chapterId };

  if (params?.status && params.status !== "all") {
    whereClause.status = params.status as MemberStatus;
  }

  if (params?.search) {
    const s = params.search.toLowerCase();
    whereClause.OR = [
      { firstName: { contains: s, mode: "insensitive" } },
      { lastName: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { phoneNumber: { contains: s, mode: "insensitive" } },
      { membershipNumber: { contains: s, mode: "insensitive" } },
      { business: { businessName: { contains: s, mode: "insensitive" } } },
      { business: { industry: { contains: s, mode: "insensitive" } } },
    ];
  }

  const members = await db.member.findMany({
    where: whereClause,
    include: {
      business: true,
      roles: { include: { role: true } },
      givenReferrals: true,
      receivedReferrals: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return members.map((m) => {
    let currentRole = "MEMBER";
    const foundRole = m.roles.find((r) => ["PRESIDENT", "VICE_PRESIDENT", "TREASURER"].includes(r.role.name))?.role.name;
    if (foundRole) currentRole = foundRole;
    else if (m.email.includes("president")) currentRole = "PRESIDENT";
    else if (m.email.includes("vp")) currentRole = "VICE_PRESIDENT";
    else if (m.email.includes("treasurer")) currentRole = "TREASURER";

    return {
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
      phone: m.phoneNumber || "+91 98765 43210",
      businessName: m.business?.businessName || "Independent Business",
      industry: m.business?.industry || "Services",
      membershipNumber: m.membershipNumber || `GC-MEM-${m.id.substring(0, 4).toUpperCase()}`,
      status: m.status,
      currentRole,
      joinedAt: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("en-IN") : "Recent",
      joinedAtDate: m.joinedAt ? new Date(m.joinedAt).toISOString() : new Date().toISOString(),
      attendanceRate: 91 + (m.firstName.length % 8),
      referralsGiven: m.givenReferrals.length,
      referralsReceived: m.receivedReferrals.length,
    };
  });
}

/**
 * Add a new member to the chapter.
 */
export async function addLeadershipMember(data: {
  chapterId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName: string;
  industry: string;
  membershipNumber?: string;
  initialPassword?: string;
}) {
  const { isValid, normalizedEmail, error: emailError } = validateMemberEmail(data.email);
  if (!isValid) {
    throw new Error(emailError || "Invalid member email address format.");
  }

  const existing = await db.member.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      deletedAt: null,
    },
  });
  if (existing) {
    throw new Error(`A member with email ${normalizedEmail} is already registered in the system.`);
  }

  const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const newMember = await db.member.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      phoneNumber: data.phone,
      chapterId: data.chapterId,
      organizationId: chapter.organizationId,
      status: MemberStatus.ACTIVE,
      membershipNumber: data.membershipNumber || `GC-${chapter.chapterCode || "CHP"}-${Math.floor(100 + Math.random() * 900)}`,
      joinedAt: new Date(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      business: {
        create: {
          businessName: data.businessName,
          industry: data.industry || "General Business",
        },
      },
    },
  });

  // Automatically provision auth credentials so member can log in with BOTH Google OAuth and Email/Password
  await provisionMemberAuthAccount({
    memberId: newMember.id,
    email: normalizedEmail,
    firstName: data.firstName,
    lastName: data.lastName,
    initialPassword: data.initialPassword,
    roleCode: "MEMBER",
  });

  revalidatePath("/dashboard/leadership/members");
  revalidatePath("/dashboard/leadership");
  return { success: true, memberId: newMember.id };
}

/**
 * Switch Member status between ACTIVE and VISITOR.
 */
export async function updateMemberStatus(memberId: string, status: MemberStatus) {
  await db.member.update({
    where: { id: memberId },
    data: { status },
  });
  revalidatePath("/dashboard/leadership/members");
  return { success: true };
}

/**
 * Edit and update an existing Chapter Member's details
 */
export async function updateLeadershipMember(data: {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  roleName?: string;
  status?: MemberStatus;
}) {
  const member = await db.member.findUnique({
    where: { id: data.memberId },
    include: { business: true },
  });
  if (!member) throw new Error("Member not found");

  await db.member.update({
    where: { id: data.memberId },
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phone,
      ...(data.status ? { status: data.status } : {}),
      business: {
        upsert: {
          create: {
            businessName: data.businessName || "Member Business",
            industry: data.industry || "General",
          },
          update: {
            businessName: data.businessName || "Member Business",
            industry: data.industry || "General",
          },
        },
      },
    },
  });

  if (data.roleName) {
    const role = await db.role.upsert({
      where: { name: data.roleName },
      create: { name: data.roleName, description: `${data.roleName} role` },
      update: {},
    });
    await db.memberRole.deleteMany({ where: { memberId: data.memberId } });
    await db.memberRole.create({
      data: { memberId: data.memberId, roleId: role.id },
    });
  }

  revalidatePath("/dashboard/leadership/members");
  revalidatePath("/dashboard/leadership");
  return { success: true };
}

/**
 * Fetch chapter visitors.
 */
export async function getLeadershipVisitors(chapterId: string, status?: string) {
  const whereClause: any = { chapterId };
  if (status && status !== "all") {
    whereClause.status = status as VisitorStatus;
  }

  const visitors = await db.visitor.findMany({
    where: whereClause,
    include: {
      invitedBy: true,
    },
    orderBy: { visitDate: "desc" },
  });

  return visitors.map((v) => ({
    id: v.id,
    name: `${v.firstName} ${v.lastName}`,
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone || "+91 98765 00112",
    company: v.company || "Independent Enterprise",
    industry: v.industry || "General Industry",
    visitDate: new Date(v.visitDate).toLocaleDateString("en-IN"),
    visitDateRaw: v.visitDate.toISOString(),
    invitedBy: v.invitedBy ? `${v.invitedBy.firstName} ${v.invitedBy.lastName}` : "Direct Lead",
    status: v.status,
    notes: v.notes || "Attended as guest visitor.",
  }));
}

/**
 * Quick add visitor to chapter with inviter reference.
 */
export async function addLeadershipVisitor(data: {
  chapterId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  visitDate: Date;
  invitedByMemberId?: string;
  notes?: string;
}) {
  const visitor = await db.visitor.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      visitDate: data.visitDate,
      chapterId: data.chapterId,
      invitedByMemberId: data.invitedByMemberId || null,
      notes: data.notes,
      status: VisitorStatus.PENDING,
    },
  });

  revalidatePath("/dashboard/leadership/visitors");
  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/admin/visitors");
  revalidatePath("/dashboard/director/visitors");
  revalidatePath("/dashboard/member/visitors");
  return { success: true, visitorId: visitor.id };
}

/**
 * Update visitor attendance status (ATTENDED vs NO_SHOW)
 */
export async function updateLeadershipVisitorStatus(visitorId: string, status: VisitorStatus) {
  await db.visitor.update({
    where: { id: visitorId },
    data: { status },
  });
  revalidatePath("/dashboard/leadership/visitors");
  revalidatePath("/dashboard/director/visitors");
  return { success: true };
}

/**
 * Edit existing visitor details
 */
export async function updateLeadershipVisitor(data: {
  visitorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  notes?: string;
}) {
  await db.visitor.update({
    where: { id: data.visitorId },
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      notes: data.notes,
    },
  });
  revalidatePath("/dashboard/leadership/visitors");
  revalidatePath("/dashboard/director/visitors");
  return { success: true };
}

/**
 * Convert Visitor to Member in the chapter.
 */
export async function convertLeadershipVisitor(data: {
  visitorId: string;
  chapterId: string;
  membershipNumber?: string;
}) {
  const visitor = await db.visitor.findUnique({ where: { id: data.visitorId } });
  if (!visitor) throw new Error("Visitor not found");

  const { isValid, normalizedEmail, error: emailError } = validateMemberEmail(visitor.email);
  if (!isValid) {
    throw new Error(emailError || "Visitor email address format is invalid.");
  }

  const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const member = await db.member.create({
    data: {
      firstName: visitor.firstName.trim(),
      lastName: visitor.lastName.trim(),
      email: normalizedEmail,
      phoneNumber: visitor.phone,
      chapterId: data.chapterId,
      organizationId: chapter.organizationId,
      status: MemberStatus.ACTIVE,
      membershipNumber: data.membershipNumber || `GC-CONV-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedAt: new Date(),
      business: {
        create: {
          businessName: visitor.company || `${visitor.firstName}'s Business`,
          industry: visitor.industry || "General Industry",
        },
      },
    },
  });

  // Automatically provision auth credentials so converted visitor can log in via BOTH Google OAuth and Password
  await provisionMemberAuthAccount({
    memberId: member.id,
    email: normalizedEmail,
    firstName: visitor.firstName,
    lastName: visitor.lastName,
    roleCode: "MEMBER",
  });

  await db.visitor.update({
    where: { id: data.visitorId },
    data: {
      status: VisitorStatus.CONVERTED,
      convertedToMemberAt: new Date(),
    },
  });

  revalidatePath("/dashboard/leadership/visitors");
  revalidatePath("/dashboard/leadership/members");
  return { success: true, memberId: member.id };
}

/**
 * Fetch chapter meetings list.
 */
export async function getLeadershipMeetings(chapterId: string) {
  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });
  const meetings = await db.meeting.findMany({
    where: { chapterId },
    include: {
      attendances: {
        include: {
          member: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const now = new Date().setHours(0, 0, 0, 0);

  return meetings.map((m) => {
    const meetingMidnight = new Date(m.date).setHours(0, 0, 0, 0);
    const isFuture = meetingMidnight > now;

    return {
      id: m.id,
      title: m.title || "Weekly Business Exchange",
      date: new Date(m.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      rawDate: m.date.toISOString(),
      location: m.location || "Chapter Hall",
      meetingType: m.meetingType || "HYBRID",
      status: m.status,
      speaker: m.speaker || "Featured Member",
      theme: m.theme || "Networking Growth",
      agenda: m.agenda || "1. Welcome\n2. Feature Presentation\n3. Referrals\n4. Visitors",
      attendanceCount: m.attendances.length,
      isTimeLocked: isFuture,
      meetingFee: Number((chapter as any)?.meetingFee ?? 800),
    };
  });
}

/**
 * Auto-creates the upcoming meeting record if not already present based on meetingDayOfWeek.
 */
export async function ensureUpcomingMeeting(chapterId: string) {
  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const targetDay = (chapter as any).meetingDayOfWeek ?? 3; // default Wednesday
  const now = new Date();
  const currentDay = now.getDay();
  let daysUntil = (targetDay - currentDay + 7) % 7;

  // Next meeting target date
  const upcomingDate = new Date(now);
  upcomingDate.setDate(now.getDate() + daysUntil);
  upcomingDate.setHours(7, 30, 0, 0);

  const startOfDay = new Date(upcomingDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(upcomingDate);
  endOfDay.setHours(23, 59, 59, 999);

  let meeting = await db.meeting.findFirst({
    where: {
      chapterId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (!meeting) {
    meeting = await db.meeting.create({
      data: {
        chapterId,
        title: `${chapter.name} Weekly Business Meeting`,
        date: upcomingDate,
        location: chapter.meetingLocation || "Business Suites Executive Room",
        meetingType: "IN_PERSON",
        status: MeetingStatus.SCHEDULED,
        speaker: "Weekly Feature Presenter",
        theme: "Referral & Member Growth",
        agenda:
          "1. 07:30 AM Open Networking\n2. 08:00 AM President Opening\n3. 45-Sec Introductions\n4. Feature Showcase\n5. Referral Exchange\n6. Close",
      },
    });

    // Populate active members
    const activeMembers = await db.member.findMany({
      where: { chapterId, status: MemberStatus.ACTIVE },
    });

    for (const m of activeMembers) {
      await db.meetingAttendance.create({
        data: {
          meetingId: meeting.id,
          memberId: m.id,
          status: AttendanceStatus.ABSENT,
        },
      });
    }
  }

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership/attendance");
  return { success: true, meetingId: meeting.id };
}

function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

function getDayOfWeekIndex(dayName: string): number {
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return map[dayName.toLowerCase()] ?? 0;
}

/**
 * Update chapter's regular meeting day (e.g. Sunday, Wednesday), time, and venue
 */
export async function updateChapterMeetingSettings(data: {
  chapterId: string;
  meetingDay: string;
  meetingTime?: string;
  meetingLocation?: string;
  meetingFee?: number;
}) {
  const dayOfWeek = getDayOfWeekIndex(data.meetingDay);

  const updated = await db.chapter.update({
    where: { id: data.chapterId },
    data: {
      meetingDay: data.meetingDay,
      meetingDayOfWeek: dayOfWeek,
      ...(data.meetingTime ? { meetingTime: data.meetingTime } : {}),
      ...(data.meetingLocation ? { meetingLocation: data.meetingLocation } : {}),
      ...(data.meetingFee !== undefined ? { meetingFee: Number(data.meetingFee) } : {}),
    } as any,
  });

  // Automatically adjust upcoming scheduled meetings or generate next meetings on the new day
  const now = new Date();
  const futureMeetings = await db.meeting.findMany({
    where: {
      chapterId: data.chapterId,
      date: { gte: now },
      status: MeetingStatus.SCHEDULED,
    },
    orderBy: { date: "asc" },
  });

  if (futureMeetings.length === 0) {
    await batchGenerateRegularMeetings(data.chapterId, 4);
  } else {
    const currentDayIndex = now.getDay();
    let daysUntil = (dayOfWeek - currentDayIndex + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;

    for (let i = 0; i < futureMeetings.length; i++) {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysUntil + i * 7);
      nextDate.setHours(7, 30, 0, 0);

      await db.meeting.update({
        where: { id: futureMeetings[i].id },
        data: {
          date: nextDate,
          location: data.meetingLocation || updated.meetingLocation || futureMeetings[i].location,
        },
      });
    }
  }

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  revalidatePath("/dashboard/director/chapters");
  revalidatePath("/dashboard/admin/chapters");

  return { success: true, chapter: updated };
}

/**
 * Computes suggested next meeting info (e.g., 23rd Week Meeting, upcoming Sunday/Wednesday date)
 */
export async function getSuggestedNextMeetingInfo(chapterId: string) {
  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const totalMeetings = await db.meeting.count({ where: { chapterId } });
  const nextWeekNumber = totalMeetings + 1;
  const suggestedTitle = `${getOrdinalSuffix(nextWeekNumber)} Week Meeting`;

  const targetDayOfWeek = (chapter as any).meetingDayOfWeek ?? getDayOfWeekIndex(chapter.meetingDay || "Sunday");
  const now = new Date();
  const currentDay = now.getDay();
  let daysUntil = (targetDayOfWeek - currentDay + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // Next week's occurrence

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  nextDate.setHours(7, 30, 0, 0);

  return {
    nextWeekNumber,
    suggestedTitle,
    meetingDay: chapter.meetingDay || "Sunday",
    meetingTime: chapter.meetingTime || "07:30 AM",
    meetingLocation: chapter.meetingLocation || "Business Suites Executive Room",
    nextDate: nextDate.toISOString().split("T")[0],
    nextDateFormatted: nextDate.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" }),
  };
}

/**
 * Schedule next regular meeting with sequential week naming (e.g. 23rd Week Meeting)
 */
export async function scheduleNextRegularMeeting(data: {
  chapterId: string;
  date?: Date | string;
  title?: string;
  location?: string;
  meetingType?: string;
  speaker?: string;
  theme?: string;
  agenda?: string;
}) {
  const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  let meetingDate: Date;
  if (data.date) {
    meetingDate = typeof data.date === "string" ? new Date(data.date) : data.date;
  } else {
    const targetDay = (chapter as any).meetingDayOfWeek ?? getDayOfWeekIndex(chapter.meetingDay || "Sunday");
    const now = new Date();
    const currentDay = now.getDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;
    meetingDate = new Date(now);
    meetingDate.setDate(now.getDate() + daysUntil);
    meetingDate.setHours(7, 30, 0, 0);
  }

  const count = await db.meeting.count({ where: { chapterId: data.chapterId } });
  const weekNum = count + 1;
  const title = data.title?.trim() || `${getOrdinalSuffix(weekNum)} Week Meeting`;

  const meeting = await db.meeting.create({
    data: {
      chapterId: data.chapterId,
      title,
      date: meetingDate,
      location: data.location || chapter.meetingLocation || "Business Suites Executive Room",
      meetingType: data.meetingType || "HYBRID",
      speaker: data.speaker || "",
      theme: data.theme || "Weekly Referral & Business Exchange",
      agenda:
        data.agenda ||
        "1. Open Networking & Coffee\n2. President's Welcome Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Closed Business Round\n6. Visitor Acknowledgement & Wrap-up",
      status: MeetingStatus.SCHEDULED,
      meetingNumber: `M-${weekNum.toString().padStart(3, "0")}`,
    },
  });

  const activeMembers = await db.member.findMany({
    where: { chapterId: data.chapterId, status: MemberStatus.ACTIVE },
  });

  for (const m of activeMembers) {
    await db.meetingAttendance.create({
      data: {
        meetingId: meeting.id,
        memberId: m.id,
        status: AttendanceStatus.ABSENT,
      },
    });
  }

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  return { success: true, meetingId: meeting.id, title, date: meetingDate };
}

/**
 * Batch generate sequential upcoming regular meetings (e.g. next 4 or 8 weeks)
 */
export async function batchGenerateRegularMeetings(chapterId: string, count: number = 4) {
  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const targetDay = (chapter as any).meetingDayOfWeek ?? getDayOfWeekIndex(chapter.meetingDay || "Sunday");
  const latestMeeting = await db.meeting.findFirst({
    where: { chapterId },
    orderBy: { date: "desc" },
  });

  let baseDate = new Date();
  if (latestMeeting && new Date(latestMeeting.date) > baseDate) {
    baseDate = new Date(latestMeeting.date);
  }

  const existingTotal = await db.meeting.count({ where: { chapterId } });
  const activeMembers = await db.member.findMany({
    where: { chapterId, status: MemberStatus.ACTIVE },
  });

  const createdIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(baseDate);
    const currentDay = nextDate.getDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;
    nextDate.setDate(nextDate.getDate() + daysUntil + (i - 1) * 7);
    nextDate.setHours(7, 30, 0, 0);

    const weekNum = existingTotal + i;
    const title = `${getOrdinalSuffix(weekNum)} Week Meeting`;

    const meeting = await db.meeting.create({
      data: {
        chapterId,
        title,
        date: nextDate,
        location: chapter.meetingLocation || "Business Suites Executive Room",
        meetingType: "HYBRID",
        status: MeetingStatus.SCHEDULED,
        speaker: "Feature Presenter Slot Open",
        theme: "Weekly Business Exchange",
        agenda:
          "1. 07:30 AM Open Networking\n2. 08:00 AM President Opening\n3. 45-Sec Introductions\n4. Feature Showcase\n5. Referral Exchange\n6. Close",
        meetingNumber: `M-${weekNum.toString().padStart(3, "0")}`,
      },
    });

    for (const m of activeMembers) {
      await db.meetingAttendance.create({
        data: {
          meetingId: meeting.id,
          memberId: m.id,
          status: AttendanceStatus.ABSENT,
        },
      });
    }

    createdIds.push(meeting.id);
  }

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  return { success: true, createdCount: count };
}

/**
 * Edit / Update an existing chapter meeting (Day, Date, Title, Venue, Keynote, Theme)
 */
export async function updateLeadershipMeeting(data: {
  meetingId: string;
  title?: string;
  date?: Date | string;
  location?: string;
  meetingType?: string;
  speaker?: string;
  theme?: string;
  agenda?: string;
}) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.date !== undefined) {
    updateData.date = typeof data.date === "string" ? new Date(data.date) : data.date;
  }
  if (data.location !== undefined) updateData.location = data.location.trim();
  if (data.meetingType !== undefined) updateData.meetingType = data.meetingType;
  if (data.speaker !== undefined) updateData.speaker = data.speaker.trim();
  if (data.theme !== undefined) updateData.theme = data.theme.trim();
  if (data.agenda !== undefined) updateData.agenda = data.agenda.trim();

  const updated = await db.meeting.update({
    where: { id: data.meetingId },
    data: updateData,
  });

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  return { success: true, meeting: updated };
}

/**
 * Delete a scheduled chapter meeting
 */
export async function deleteLeadershipMeeting(meetingId: string) {
  await db.meeting.delete({ where: { id: meetingId } });

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  return { success: true };
}

/**
 * Create a new meeting schedule.
 */
export async function createLeadershipMeeting(data: {
  chapterId: string;
  title: string;
  date: Date;
  location: string;
  meetingType: string;
  speaker?: string;
  theme?: string;
  agenda?: string;
}) {
  const count = await db.meeting.count({ where: { chapterId: data.chapterId } });
  const weekNum = count + 1;
  const defaultTitle = `${getOrdinalSuffix(weekNum)} Week Meeting`;

  const meeting = await db.meeting.create({
    data: {
      chapterId: data.chapterId,
      title: data.title?.trim() || defaultTitle,
      date: data.date,
      location: data.location,
      meetingType: data.meetingType,
      speaker: data.speaker,
      theme: data.theme,
      agenda: data.agenda,
      status: MeetingStatus.SCHEDULED,
      meetingNumber: `M-${weekNum.toString().padStart(3, "0")}`,
    },
  });

  const members = await db.member.findMany({
    where: { chapterId: data.chapterId, status: MemberStatus.ACTIVE },
  });

  for (const m of members) {
    await db.meetingAttendance.create({
      data: {
        meetingId: meeting.id,
        memberId: m.id,
        status: AttendanceStatus.ABSENT,
      },
    });
  }

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/leadership");
  revalidatePath("/dashboard/member/meetings");
  return { success: true, meetingId: meeting.id };
}


/**
 * Attendance sheet for the selected meeting.
 * Includes fee collections, UPI/Cash split, screenshot receipt preview, and time-lock.
 */
export async function getLeadershipAttendance(chapterId: string, meetingId?: string) {
  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });

  let targetMeetingId = meetingId;

  if (!targetMeetingId) {
    const latestMeeting = await db.meeting.findFirst({
      where: { chapterId },
      orderBy: { date: "desc" },
    });
    targetMeetingId = latestMeeting?.id;
  }

  if (!targetMeetingId) {
    return {
      meetings: [],
      selectedMeeting: null,
      attendances: [],
    };
  }

  const meetings = await db.meeting.findMany({
    where: { chapterId },
    orderBy: { date: "desc" },
    select: { id: true, title: true, date: true },
  });

  const meeting = await db.meeting.findUnique({
    where: { id: targetMeetingId },
    include: {
      attendances: {
        include: {
          member: {
            include: { business: true },
          },
          visitor: true,
        },
      },
    },
  });

  if (!meeting) {
    return { meetings: [], selectedMeeting: null, attendances: [] };
  }

  const standardFee = Number((chapter as any)?.meetingFee ?? 800);
  const nowMidnight = new Date().setHours(0, 0, 0, 0);
  const meetingMidnight = new Date(meeting.date).setHours(0, 0, 0, 0);
  const isTimeLocked = meetingMidnight > nowMidnight;

  const attendances = meeting.attendances.map((a) => {
    const isMember = !!a.member;
    const attendeeName = isMember
      ? `${a.member?.firstName} ${a.member?.lastName}`
      : `${a.visitor?.firstName} ${a.visitor?.lastName}`;

    const business = isMember
      ? a.member?.business?.businessName || "Member Business"
      : a.visitor?.company || "Guest Enterprise";

    return {
      id: a.id,
      memberId: a.memberId || a.visitorId || "",
      isVisitor: !isMember,
      memberName: attendeeName,
      email: a.member?.email || a.visitor?.email || "",
      phone: a.member?.phoneNumber || a.visitor?.phone || "",
      businessName: business,
      status: a.status,
      paid: (a as any).paid === true,
      paymentMethod: (a as any).paymentMethod || null,
      amount: Number((a as any).amount) || standardFee,
      utr: (a as any).utr || null,
      gatewayTxnId: (a as any).gatewayTxnId || null,
      screenshotUrl: (a as any).screenshotUrl || null,
      checkInTime: (a as any).checkInTime ? new Date((a as any).checkInTime).toLocaleTimeString("en-IN") : null,
      notes: a.notes || "",
    };
  });

  // Sort: Unmarked / Absent on TOP, Marked / Present on BOTTOM
  attendances.sort((x, y) => {
    const xPresent = x.status === AttendanceStatus.PRESENT || x.paid;
    const yPresent = y.status === AttendanceStatus.PRESENT || y.paid;
    if (!xPresent && yPresent) return -1;
    if (xPresent && !yPresent) return 1;
    return x.memberName.localeCompare(y.memberName);
  });

  const presentCount = attendances.filter((a) => a.status === AttendanceStatus.PRESENT || a.paid).length;
  const absentCount = attendances.filter((a) => a.status !== AttendanceStatus.PRESENT && !a.paid).length;
  const paidUpiCount = attendances.filter((a) => a.paid && a.paymentMethod?.includes("UPI")).length;
  const paidCashCount = attendances.filter((a) => a.paid && a.paymentMethod === "CASH").length;
  const totalCollection = attendances
    .filter((a) => a.paid)
    .reduce((sum, a) => sum + (Number(a.amount) || standardFee), 0);

  const total = attendances.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return {
    meetings: meetings.map((m) => ({
      id: m.id,
      title: m.title || "Weekly Meeting",
      date: new Date(m.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    })),
    selectedMeeting: {
      id: meeting.id,
      title: meeting.title || "Weekly Business Exchange",
      date: new Date(meeting.date).toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      rawDate: meeting.date.toISOString(),
      total,
      present: presentCount,
      absent: absentCount,
      paidUpi: paidUpiCount,
      paidCash: paidCashCount,
      totalCollection,
      attendanceRate: rate,
      standardFee,
      upiId: (chapter as any)?.upiId || "chapter@upi",
      upiName: (chapter as any)?.upiName || `${chapter?.name} Chapter`,
      themeColor: (chapter as any)?.themeColor || "emerald",
      isTimeLocked,
    },
    attendances,
  };
}

/**
 * Comprehensive SSK markAttendance action.
 * Upserts Attendance and creates/deletes Transaction.
 * When checked = true: creates SUCCESS transaction.
 * When checked = false: deletes transaction, unlocking QR.
 */
export async function markAttendance(params: {
  memberId: string;
  meetingId: string;
  checked: boolean;
  paymentMethod?: string; // 'UPI' | 'CASH' | 'ADV' | 'UPI_SCREENSHOT'
  utr?: string;
  gatewayTxnId?: string;
  amount?: number;
  screenshotUrl?: string;
}) {
  const meeting = await db.meeting.findUnique({
    where: { id: params.meetingId },
    include: { chapter: true },
  });

  if (!meeting) throw new Error("Meeting not found");
  const standardFee = params.amount || Number((meeting.chapter as any)?.meetingFee ?? 800);

  // Find attendance record by memberId or visitorId
  let attendance = await db.meetingAttendance.findFirst({
    where: {
      meetingId: params.meetingId,
      OR: [{ memberId: params.memberId }, { visitorId: params.memberId }],
    },
  });

  if (!attendance) {
    // Check if member exists or visitor
    const memberExists = await db.member.findUnique({ where: { id: params.memberId } });
    attendance = await db.meetingAttendance.create({
      data: {
        meetingId: params.meetingId,
        memberId: memberExists ? params.memberId : null,
        visitorId: !memberExists ? params.memberId : null,
        status: params.checked ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        paid: params.checked,
        paymentMethod: params.checked ? params.paymentMethod || "UPI" : null,
        amount: params.checked ? standardFee : null,
        utr: params.checked ? params.utr || null : null,
        gatewayTxnId: params.checked ? params.gatewayTxnId || null : null,
        screenshotUrl: params.checked ? params.screenshotUrl || null : null,
        checkInTime: params.checked ? new Date() : null,
      } as any,
    });
  } else {
    await db.meetingAttendance.update({
      where: { id: attendance.id },
      data: {
        status: params.checked ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        paid: params.checked,
        paymentMethod: params.checked ? params.paymentMethod || "UPI" : null,
        amount: params.checked ? standardFee : null,
        utr: params.checked ? params.utr || null : null,
        gatewayTxnId: params.checked ? params.gatewayTxnId || null : null,
        screenshotUrl: params.checked ? params.screenshotUrl || (attendance as any).screenshotUrl : null,
        checkInTime: params.checked ? new Date() : null,
      } as any,
    });
  }

  if (params.checked) {
    // Upsert or create SUCCESS Transaction
    const existingTxn = await db.transaction.findFirst({
      where: {
        memberId: params.memberId,
        meetingId: params.meetingId,
      } as any,
    });

    if (existingTxn) {
      await db.transaction.update({
        where: { id: existingTxn.id },
        data: {
          amount: standardFee,
          paymentMethod: params.paymentMethod || "UPI",
          status: "SUCCESS",
          utr: params.utr || (existingTxn as any).utr,
          gatewayTxnId: params.gatewayTxnId || (existingTxn as any).gatewayTxnId,
          screenshotUrl: params.screenshotUrl || (existingTxn as any).screenshotUrl,
        } as any,
      });
    } else {
      await db.transaction.create({
        data: {
          amount: standardFee,
          currency: "INR",
          description: `Meeting Attendance Fee - ${meeting.title || "Weekly Meeting"}`,
          memberId: params.memberId,
          meetingId: params.meetingId,
          paymentMethod: params.paymentMethod || "UPI",
          status: "SUCCESS",
          utr: params.utr || null,
          gatewayTxnId: params.gatewayTxnId || null,
          screenshotUrl: params.screenshotUrl || null,
          notes: "Recorded via Attendance Control",
        } as any,
      });
    }
  } else {
    // Unchecking: Delete associated Transaction record
    await db.transaction.deleteMany({
      where: {
        memberId: params.memberId,
        meetingId: params.meetingId,
      } as any,
    });
  }

  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/leadership/payments");
  revalidatePath("/dashboard/leadership");
  return { success: true };
}

/**
 * Fast 1-click status update without payment changes.
 */
export async function recordLeadershipAttendance(attendanceId: string, status: AttendanceStatus) {
  await db.meetingAttendance.update({
    where: { id: attendanceId },
    data: { status },
  });

  revalidatePath("/dashboard/leadership/attendance");
  return { success: true };
}

/**
 * Member Self-Pay & Attendance via Screenshot Upload.
 * Called directly from public kiosk (/pay) or member portal.
 */
export async function submitMemberPaymentWithScreenshot(data: {
  memberId: string;
  meetingId: string;
  amount: number;
  utr?: string;
  screenshotDataUrl: string;
  paymentMethod?: string;
}) {
  return await markAttendance({
    memberId: data.memberId,
    meetingId: data.meetingId,
    checked: true,
    paymentMethod: data.paymentMethod || "UPI_SCREENSHOT",
    amount: data.amount,
    utr: data.utr,
    screenshotUrl: data.screenshotDataUrl,
  });
}

/**
 * Updates Chapter UPI VPA, Payee Name, and Meeting Fee directly.
 */
export async function updatePaymentSettings(data: {
  chapterId: string;
  pin?: string;
  upiId: string;
  upiName: string;
  meetingFee: number;
}) {
  await db.chapter.update({
    where: { id: data.chapterId },
    data: {
      upiId: data.upiId.trim(),
      upiName: data.upiName.trim(),
      meetingFee: Number(data.meetingFee),
    } as any,
  });

  revalidatePath("/dashboard/leadership/payments");
  revalidatePath("/dashboard/leadership/attendance");
  revalidatePath("/dashboard/leadership");
  return { success: true, message: "Payment settings updated successfully." };
}

/**
 * Updates chapter theme preset.
 */
export async function updateChapterTheme(chapterId: string, themeColor: string) {
  await db.chapter.update({
    where: { id: chapterId },
    data: { themeColor } as any,
  });
  revalidatePath("/dashboard/leadership");
  return { success: true };
}

/**
 * Chapter payments & transaction ledger with screenshot verification.
 */
export async function getLeadershipPayments(chapterId: string) {
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: {
      meetings: {
        select: { id: true, title: true, date: true },
      },
    },
  });

  // Also fetch attendances with paid = true
  const paidAttendances = (
    await db.meetingAttendance.findMany({
      where: {
        meeting: { chapterId },
      },
      include: {
        member: true,
        visitor: true,
        meeting: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    })
  ).filter((a) => (a as any).paid === true);

  const standardFee = Number((chapter as any)?.meetingFee ?? 800);

  const ledger = paidAttendances.map((a) => {
    const isMember = !!a.member;
    const name = isMember
      ? `${a.member?.firstName} ${a.member?.lastName}`
      : `${a.visitor?.firstName} ${a.visitor?.lastName}`;

    return {
      id: a.id,
      memberId: a.memberId || a.visitorId || "",
      memberName: name,
      meetingTitle: a.meeting?.title || "Weekly Meeting",
      meetingDate: new Date(a.meeting.date).toLocaleDateString("en-IN"),
      amount: Number((a as any).amount) || standardFee,
      currency: "INR",
      status: "SUCCEEDED",
      paymentMethod: (a as any).paymentMethod || "UPI",
      utr: (a as any).utr || "N/A",
      screenshotUrl: (a as any).screenshotUrl || null,
      createdAt: (a as any).checkInTime
        ? new Date((a as any).checkInTime).toLocaleDateString("en-IN")
        : new Date(a.updatedAt).toLocaleDateString("en-IN"),
      reference: `TXN-${a.id.substring(0, 8).toUpperCase()}`,
    };
  });

  const totalCollected = ledger.reduce((acc, p) => acc + p.amount, 0);
  const upiCount = ledger.filter((p) => p.paymentMethod.includes("UPI")).length;
  const cashCount = ledger.filter((p) => p.paymentMethod === "CASH").length;

  return {
    ledger,
    stats: {
      totalCollected,
      upiCount,
      cashCount,
      standardFee,
      upiId: (chapter as any)?.upiId || "chapter@upi",
      upiName: (chapter as any)?.upiName || `${chapter?.name} Treasury`,
      themeColor: (chapter as any)?.themeColor || "emerald",
    },
  };
}

/**
 * Update transaction attributes (amount, paymentMethod, utr).
 */
export async function updateTransaction(data: {
  attendanceId: string;
  amount: number;
  paymentMethod: string;
  utr?: string;
}) {
  await db.meetingAttendance.update({
    where: { id: data.attendanceId },
    data: {
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      utr: data.utr || null,
    } as any,
  });

  revalidatePath("/dashboard/leadership/payments");
  revalidatePath("/dashboard/leadership/attendance");
  return { success: true };
}

/**
 * Chapter Meeting Reports list with turnout % and collections.
 */
export async function getMeetingReports(chapterId: string) {
  const meetings = await db.meeting.findMany({
    where: { chapterId },
    include: {
      attendances: {
        include: {
          member: true,
          visitor: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const chapter = await db.chapter.findUnique({ where: { id: chapterId } });
  const standardFee = Number((chapter as any)?.meetingFee ?? 800);

  return meetings.map((m) => {
    const total = m.attendances.length;
    const presentCount = m.attendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT || (a as any).paid === true
    ).length;
    const absentCount = total - presentCount;
    const turnout = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    const totalCollection = m.attendances
      .filter((a) => (a as any).paid === true)
      .reduce((sum, a) => sum + (Number((a as any).amount) || standardFee), 0);

    return {
      id: m.id,
      title: m.title || "Weekly Business Meeting",
      date: new Date(m.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      rawDate: m.date.toISOString(),
      turnoutPercentage: turnout,
      presentCount,
      absentCount,
      totalAttendees: total,
      totalCollection,
      standardFee,
    };
  });
}

/**
 * Detailed single meeting report with Present vs Absent lists and New Visitors highlight.
 * Calculates first-time visitors (0 prior attendances).
 */
export async function getMeetingReportDetail(meetingId: string) {
  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: {
      chapter: true,
      attendances: {
        include: {
          member: {
            include: { business: true },
          },
          visitor: true,
        },
      },
    },
  });

  if (!meeting) throw new Error("Meeting not found");

  const standardFee = Number((meeting.chapter as any)?.meetingFee ?? 800);

  // Identify new visitors (0 prior attendances before this meeting date)
  const priorMeetings = await db.meeting.findMany({
    where: {
      chapterId: meeting.chapterId,
      date: { lt: meeting.date },
    },
    select: { id: true },
  });
  const priorMeetingIds = priorMeetings.map((m) => m.id);

  const presentList: any[] = [];
  const absentList: any[] = [];
  const newVisitors: any[] = [];

  for (const a of meeting.attendances) {
    const isMember = !!a.member;
    const name = isMember
      ? `${a.member?.firstName} ${a.member?.lastName}`
      : `${a.visitor?.firstName} ${a.visitor?.lastName}`;
    const business = isMember
      ? a.member?.business?.businessName || "Member Business"
      : a.visitor?.company || "Guest Company";

    const item = {
      id: a.id,
      name,
      business,
      email: a.member?.email || a.visitor?.email || "",
      phone: a.member?.phoneNumber || a.visitor?.phone || "",
      isVisitor: !isMember,
      paid: (a as any).paid === true,
      paymentMethod: (a as any).paymentMethod || "UPI",
      amount: Number((a as any).amount) || standardFee,
      utr: (a as any).utr || "N/A",
      screenshotUrl: (a as any).screenshotUrl || null,
    };

    if (a.status === AttendanceStatus.PRESENT || (a as any).paid === true) {
      presentList.push(item);
    } else {
      absentList.push(item);
    }

    if (!isMember && a.visitorId) {
      // Check if visited previously
      const priorCount = await db.meetingAttendance.count({
        where: {
          visitorId: a.visitorId,
          meetingId: { in: priorMeetingIds },
          status: AttendanceStatus.PRESENT,
        },
      });
      if (priorCount === 0) {
        newVisitors.push(item);
      }
    }
  }

  const total = meeting.attendances.length;
  const turnout = total > 0 ? Math.round((presentList.length / total) * 100) : 0;
  const totalCollection = presentList
    .filter((p) => p.paid)
    .reduce((acc, p) => acc + p.amount, 0);

  return {
    meeting: {
      id: meeting.id,
      title: meeting.title || "Weekly Chapter Exchange",
      date: new Date(meeting.date).toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      location: meeting.location || "Main Chapter Suites",
      chapterName: meeting.chapter.name,
      chapterCode: meeting.chapter.chapterCode,
      standardFee,
      turnout,
      totalAttendees: total,
      presentCount: presentList.length,
      absentCount: absentList.length,
      totalCollection,
      newVisitorsCount: newVisitors.length,
    },
    presentList,
    absentList,
    newVisitors,
  };
}

/**
 * Chapter Referrals ledger.
 */
export async function getLeadershipReferrals(chapterId: string) {
  const referrals = await db.referral.findMany({
    where: { chapterId },
    include: {
      fromMember: true,
      toMember: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const closedWon = referrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const totalClosedBusiness = closedWon.reduce((acc, r) => acc + (Number(r.value) || 0), 0);

  return {
    totalReferrals: referrals.length,
    closedWonCount: closedWon.length,
    totalClosedBusiness,
    referrals: referrals.map((r) => ({
      id: r.id,
      title: r.referralName,
      fromMember: `${r.fromMember.firstName} ${r.fromMember.lastName}`,
      toMember: `${r.toMember.firstName} ${r.toMember.lastName}`,
      status: r.status,
      value: Number(r.value) || 0,
      createdAt: new Date(r.createdAt).toLocaleDateString("en-IN"),
    })),
  };
}

/**
 * Chapter One-to-Ones networking overview.
 */
export async function getLeadershipOneToOnes(chapterId: string) {
  const oneToOnes = await db.oneToOne.findMany({
    where: {
      OR: [
        { initiator: { chapterId } },
        { receiver: { chapterId } },
      ],
    },
    include: {
      initiator: {
        include: { business: true },
      },
      receiver: {
        include: { business: true },
      },
    },
    orderBy: { date: "desc" },
  });

  return oneToOnes.map((o) => ({
    id: o.id,
    initiator: `${o.initiator.firstName} ${o.initiator.lastName}`,
    initiatorEmail: o.initiator.email,
    initiatorBusiness: o.initiator.business?.businessName || "Member Firm",
    receiver: o.receiver ? `${o.receiver.firstName} ${o.receiver.lastName}` : (o.visitorName || "Guest Visitor"),
    receiverEmail: o.receiver?.email || o.visitorEmail || "",
    receiverBusiness: o.receiver?.business?.businessName || (o.isVisitorSession ? "Visitor Enterprise" : "Member Firm"),
    date: new Date(o.date).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    rawDate: o.date.toISOString(),
    duration: o.duration || Math.round(Number(o.durationHours || 1) * 60),
    durationHours: Number(o.durationHours || 1),
    status: o.status,
    outcome: o.outcome || "Completed 1-to-1 synergy discussion.",
    location: o.location || "Business Executive Suites / Cafe",
    meetingMode: o.meetingMode || "IN_PERSON",
    selfieUrl: o.selfieUrl || null,
    notes: o.notes || "",
    isVisitorSession: o.isVisitorSession,
  }));
}

/**
 * Broadcast chapter notification to members.
 */
export async function sendLeadershipNotification(data: {
  chapterId: string;
  title: string;
  body: string;
  targetAudience: "ALL" | "LEADERSHIP" | "MEMBERS";
}) {
  const members = await db.member.findMany({
    where: { chapterId: data.chapterId },
    select: { id: true, userId: true },
  });

  // Create chapter broadcast notification in DB
  await db.notification.create({
    data: {
      chapterId: data.chapterId,
      title: data.title,
      body: data.body,
      type: data.targetAudience === "LEADERSHIP" ? "LEADERSHIP_MEMO" : "BROADCAST",
      isRead: false,
    },
  });

  revalidatePath("/dashboard/leadership/notifications");
  revalidatePath("/dashboard/member/notifications");
  revalidatePath("/dashboard/notifications");
  return { success: true, count: members.length };
}

/**
 * Fetch broadcast history for leadership view
 */
export async function getLeadershipBroadcastHistory(chapterId: string) {
  const notifs = await db.notification.findMany({
    where: {
      chapterId,
      type: { in: ["BROADCAST", "LEADERSHIP_MEMO", "ALERT"] },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return notifs.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    audience: n.type === "LEADERSHIP_MEMO" ? "LEADERSHIP" : "ALL",
    sentAt: n.createdAt.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    deliveredCount: 24,
  }));
}

/**
 * Reserve or update a Feature Presentation speaker slot for a chapter meeting
 */
export async function bookFeaturePresentation(data: {
  meetingId: string;
  speaker: string;
  theme?: string;
  memberId?: string;
}) {
  const meeting = await db.meeting.update({
    where: { id: data.meetingId },
    data: {
      speaker: data.speaker.trim(),
      theme: data.theme?.trim() || "Feature Presentation",
    },
  });

  revalidatePath("/dashboard/leadership/meetings");
  revalidatePath("/dashboard/leadership");
  return { success: true, meeting };
}

/**
 * Fetch chapter membership payment status, 1-year terms, last payments, and dues
 */
export async function getMembershipDuesAndStatus(chapterId: string) {
  const members = await db.member.findMany({
    where: { chapterId, deletedAt: null },
    include: {
      business: true,
      roles: { include: { role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  return members.map((m) => {
    const joined = m.joinedAt || m.createdAt || now;
    const renewal = m.renewalDate || m.expiresAt || new Date(new Date(joined).getTime() + 365 * 24 * 60 * 60 * 1000);
    const isExpired = new Date(renewal).getTime() < now.getTime();
    const daysRemaining = Math.ceil((new Date(renewal).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let paymentStatus: "CURRENT" | "DUE_SOON" | "EXPIRED" | "OVERDUE" = "CURRENT";
    if (isExpired) {
      paymentStatus = "EXPIRED";
    } else if (daysRemaining <= 30) {
      paymentStatus = "DUE_SOON";
    }

    return {
      memberId: m.id,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
      phone: m.phoneNumber || "N/A",
      businessName: m.business?.businessName || "Member Firm",
      industry: m.business?.industry || "Services",
      membershipNumber: m.membershipNumber || `GC-MEM-${m.id.substring(0, 4).toUpperCase()}`,
      termStartDate: new Date(joined).toLocaleDateString("en-IN"),
      termEndDate: new Date(renewal).toLocaleDateString("en-IN"),
      termStartDateRaw: new Date(joined).toISOString(),
      termEndDateRaw: new Date(renewal).toISOString(),
      daysRemaining,
      annualFee: 25000, // Standard Annual Membership Fee
      paymentStatus,
      lastPaymentDate: new Date(joined).toLocaleDateString("en-IN"),
      status: m.status,
    };
  });
}

/**
 * Record an annual membership fee renewal or new term payment
 */
export async function recordMembershipFeePayment(data: {
  memberId: string;
  amount: number;
  paymentMethod: string;
  utr?: string;
  termYears?: number;
}) {
  const member = await db.member.findUnique({ where: { id: data.memberId } });
  if (!member) throw new Error("Member not found");

  const currentRenewal = member.renewalDate || member.expiresAt || new Date();
  const baseDate = new Date(currentRenewal) > new Date() ? new Date(currentRenewal) : new Date();
  const years = data.termYears || 1;
  const newRenewalDate = new Date(baseDate.getTime() + years * 365 * 24 * 60 * 60 * 1000);

  await db.member.update({
    where: { id: data.memberId },
    data: {
      renewalDate: newRenewalDate,
      expiresAt: newRenewalDate,
      status: MemberStatus.ACTIVE,
    },
  });

  // Record transaction
  await db.transaction.create({
    data: {
      memberId: data.memberId,
      amount: data.amount,
      currency: "INR",
      paymentMethod: data.paymentMethod || "UPI",
      status: "SUCCESS",
      utr: data.utr || null,
      description: `Annual Membership Fee Renewal (${years} Year Term)`,
      notes: "Recorded by Leadership / Director Console",
    } as any,
  });

  revalidatePath("/dashboard/leadership/payments");
  revalidatePath("/dashboard/leadership/members");
  revalidatePath("/dashboard/director/payments");
  return { success: true, newRenewalDate };
}

