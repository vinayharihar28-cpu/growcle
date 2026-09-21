"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { MemberStatus, VisitorStatus, ReferralStatus, MeetingStatus, AttendanceStatus, PaymentStatus } from "@prisma/client";

export interface ChapterSummary {
  id: string;
  name: string;
  chapterCode: string;
  region: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  isActive: boolean;
  memberCount: number;
  presidentName: string;
  vpName: string;
  treasurerName: string;
  attendanceRate: number;
  visitorCount: number;
  visitorConversion: number;
  referralCount: number;
  closedBusiness: number;
  paymentStatus: "GOOD" | "PENDING" | "OVERDUE";
  status: "HEALTHY" | "NEEDS_ATTENTION" | "CRITICAL";
}

export interface DirectorKPIs {
  totalChapters: number;
  activeChapters: number;
  inactiveChapters: number;
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  inactiveMembers: number;
  upcomingVisitors: number;
  attendedVisitors: number;
  noShowVisitors: number;
  convertedVisitors: number;
  attendancePercentage: number;
  attendanceTrend: number;
  totalReferrals: number;
  pendingReferrals: number;
  contactedReferrals: number;
  closedWonReferrals: number;
  closedLostReferrals: number;
  totalClosedBusiness: number;
  closedBusinessTrend: number;
  totalCollected: number;
  pendingPayments: number;
  outstandingPayments: number;
}

async function getEffectiveChapterId(paramChapterId?: string): Promise<string | undefined> {
  if (paramChapterId && paramChapterId !== "all") return paramChapterId;
  if (paramChapterId === "all") return undefined;
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("active-chapter-id")?.value;
    if (cookieVal && cookieVal !== "all") return cookieVal;
  } catch (e) {
    // ignore
  }
  return undefined;
}

/**
 * Pure no-op: Do not inject dummy personas or mock records
 */
async function ensureSampleDirectorData() {
  return;
}

/**
 * Fetch Director Main Overview Data & KPIs
 */
export async function getDirectorOverview(selectedChapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(selectedChapterId);

  const chapters = await db.chapter.findMany({
    where: effectiveChapterId ? { id: effectiveChapterId } : {},
    include: {
      members: {
        include: {
          business: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
      visitors: true,
      referrals: true,
      meetings: {
        include: {
          attendances: true,
        },
      },
    },
  });

  const totalChapters = chapters.length;
  const activeChapters = chapters.filter((c) => c.isActive).length;
  const inactiveChapters = totalChapters - activeChapters;

  let totalMembers = 0;
  let activeMembers = 0;
  let pendingMembers = 0;
  let inactiveMembers = 0;

  let upcomingVisitors = 0;
  let attendedVisitors = 0;
  let noShowVisitors = 0;
  let convertedVisitors = 0;

  let totalReferrals = 0;
  let pendingReferrals = 0;
  let contactedReferrals = 0;
  let closedWonReferrals = 0;
  let closedLostReferrals = 0;
  let totalClosedBusiness = 0;

  let totalAttendancesCount = 0;
  let totalPresentCount = 0;

  const chapterSummaries: ChapterSummary[] = [];

  for (const chap of chapters) {
    const mCount = chap.members.length;
    totalMembers += mCount;
    activeMembers += chap.members.filter((m) => m.status === MemberStatus.ACTIVE).length;
    pendingMembers += chap.members.filter((m) => m.status === MemberStatus.PENDING).length;
    inactiveMembers += chap.members.filter((m) => m.status === MemberStatus.INACTIVE).length;

    const vCount = chap.visitors.length;
    upcomingVisitors += chap.visitors.filter((v) => v.status === VisitorStatus.PENDING).length;
    attendedVisitors += chap.visitors.filter((v) => v.status === VisitorStatus.ATTENDED).length;
    noShowVisitors += chap.visitors.filter((v) => v.status === VisitorStatus.NO_SHOW).length;
    const converted = chap.visitors.filter((v) => v.status === VisitorStatus.CONVERTED).length;
    convertedVisitors += converted;

    totalReferrals += chap.referrals.length;
    pendingReferrals += chap.referrals.filter((r) => r.status === ReferralStatus.PENDING).length;
    contactedReferrals += chap.referrals.filter((r) => r.status === ReferralStatus.CONTACTED).length;
    const closedWon = chap.referrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
    closedWonReferrals += closedWon.length;
    closedLostReferrals += chap.referrals.filter((r) => r.status === ReferralStatus.CLOSED_LOST).length;

    const chapClosedValue = closedWon.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    totalClosedBusiness += chapClosedValue;

    // Leadership extraction
    const pres = chap.members.find((m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president"));
    const vp = chap.members.find((m) => m.roles.some((r) => r.role.name === "VICE_PRESIDENT") || m.email.includes("vp"));
    const tres = chap.members.find((m) => m.roles.some((r) => r.role.name === "TREASURER") || m.email.includes("treasurer"));

    const conversionRate = vCount > 0 ? Math.round((converted / vCount) * 100) : 0;

    // Attendance calculation from real attendances
    const chapAttendances = chap.meetings.flatMap((m) => m.attendances);
    const chapTotalAtt = chapAttendances.length;
    const chapPresentAtt = chapAttendances.filter((a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.SUBSTITUTE).length;
    const attendanceRate = chapTotalAtt > 0 ? Math.round((chapPresentAtt / chapTotalAtt) * 100) : 0;

    totalAttendancesCount += chapTotalAtt;
    totalPresentCount += chapPresentAtt;

    chapterSummaries.push({
      id: chap.id,
      name: chap.name,
      chapterCode: chap.chapterCode || `CHP-${chap.id.substring(0, 4)}`,
      region: chap.region || "Primary Region",
      location: chap.meetingLocation || "Main Conference Center",
      meetingDay: chap.meetingDay || "Wednesday",
      meetingTime: chap.meetingTime || "07:30 AM",
      isActive: chap.isActive,
      memberCount: mCount,
      presidentName: pres ? `${pres.firstName} ${pres.lastName}` : "Unassigned",
      vpName: vp ? `${vp.firstName} ${vp.lastName}` : "Unassigned",
      treasurerName: tres ? `${tres.firstName} ${tres.lastName}` : "Unassigned",
      attendanceRate,
      visitorCount: vCount,
      visitorConversion: conversionRate,
      referralCount: chap.referrals.length,
      closedBusiness: chapClosedValue,
      paymentStatus: "GOOD",
      status: pres && vp && tres ? "HEALTHY" : "NEEDS_ATTENTION",
    });
  }

  let memberIds: string[] | undefined = undefined;
  if (effectiveChapterId) {
    const chapterMembers = await db.member.findMany({
      where: { chapterId: effectiveChapterId },
      select: { id: true },
    });
    memberIds = chapterMembers.map((m) => m.id);
  }

  const [paidInvoices, pendingInvoices, failedInvoices] = await Promise.all([
    db.invoice.aggregate({
      where: {
        status: PaymentStatus.SUCCEEDED,
        ...(memberIds ? { memberId: { in: memberIds } } : {}),
      },
      _sum: { total: true },
    }),
    db.invoice.aggregate({
      where: {
        status: PaymentStatus.PENDING,
        ...(memberIds ? { memberId: { in: memberIds } } : {}),
      },
      _sum: { total: true },
    }),
    db.invoice.aggregate({
      where: {
        status: PaymentStatus.FAILED,
        ...(memberIds ? { memberId: { in: memberIds } } : {}),
      },
      _sum: { total: true },
    }),
  ]);

  const totalCollected = Number(paidInvoices._sum?.total || 0);
  const pendingPayments = Number(pendingInvoices._sum?.total || 0);
  const outstandingPayments = Number(failedInvoices._sum?.total || 0);

  const overallAttendancePercentage = totalAttendancesCount > 0
    ? Math.round((totalPresentCount / totalAttendancesCount) * 100)
    : 0;

  const kpis: DirectorKPIs = {
    totalChapters,
    activeChapters,
    inactiveChapters,
    totalMembers,
    activeMembers,
    pendingMembers,
    inactiveMembers,
    upcomingVisitors,
    attendedVisitors,
    noShowVisitors,
    convertedVisitors,
    attendancePercentage: overallAttendancePercentage,
    attendanceTrend: 0,
    totalReferrals,
    pendingReferrals,
    contactedReferrals,
    closedWonReferrals,
    closedLostReferrals,
    totalClosedBusiness,
    closedBusinessTrend: 0,
    totalCollected,
    pendingPayments,
    outstandingPayments,
  };

  return {
    kpis,
    chapters: chapterSummaries,
  };
}

/**
 * Get assigned chapters list
 */
export async function getAssignedChapters() {
  await ensureSampleDirectorData();
  const chapters = await db.chapter.findMany({
    orderBy: { name: "asc" },
    include: {
      members: {
        include: {
          business: true,
        },
      },
      visitors: true,
      referrals: true,
    },
  });

  return chapters.map((c) => ({
    id: c.id,
    name: c.name,
    chapterCode: c.chapterCode || `CHP-${c.id.substring(0, 4)}`,
    region: c.region || "Region",
    location: c.meetingLocation || "Meeting Hall",
    meetingDay: c.meetingDay || "Wednesday",
    meetingTime: c.meetingTime || "07:30 AM",
    isActive: c.isActive,
    memberCount: c.members.length,
    visitorCount: c.visitors.length,
    referralCount: c.referrals.length,
  }));
}

/**
 * Create a new Chapter (Wizard)
 */
export async function createDirectorChapter(data: {
  name: string;
  chapterCode?: string;
  region?: string;
  meetingDay?: string;
  meetingTime?: string;
  meetingLocation?: string;
  description?: string;
  themeColor?: string;
}) {
  const org = await db.organization.findFirst();
  if (!org) throw new Error("No organization found");

  const existingCount = await db.chapter.count();
  const THEME_PALETTE = ["emerald", "purple", "amber", "rose", "cyan", "indigo", "crimson", "orange"];
  const assignedTheme = data.themeColor || THEME_PALETTE[existingCount % THEME_PALETTE.length];

  const newChapter = await db.chapter.create({
    data: {
      name: data.name,
      chapterCode: data.chapterCode || `GC-${Math.floor(100 + Math.random() * 900)}`,
      region: data.region || "Global Region",
      meetingDay: data.meetingDay || "Wednesday",
      meetingTime: data.meetingTime || "07:30 AM",
      meetingLocation: data.meetingLocation || "Virtual Headquarters",
      description: data.description || "Newly established Growcle networking chapter.",
      organizationId: org.id,
      isActive: true,
    },
  });

  // Ensure themeColor is saved
  await db.$executeRawUnsafe(
    `UPDATE "Chapter" SET "themeColor" = $1 WHERE id = $2`,
    assignedTheme,
    newChapter.id
  ).catch(() => {});

  revalidatePath("/dashboard/director");
  revalidatePath("/dashboard/director/chapters");
  revalidatePath("/dashboard/admin/chapters");
  return newChapter;
}

/**
 * Get Members across assigned chapters with search & filters
 */
export async function getDirectorMembers(params?: {
  search?: string;
  chapterId?: string;
  status?: string;
}) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(params?.chapterId);

  const whereClause: any = {};

  if (effectiveChapterId) {
    whereClause.chapterId = effectiveChapterId;
  }

  if (params?.status && params.status !== "all") {
    whereClause.status = params.status as MemberStatus;
  }

  if (params?.search) {
    const s = params.search.toLowerCase();
    whereClause.OR = [
      { firstName: { contains: s, mode: "insensitive" } },
      { lastName: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { membershipNumber: { contains: s, mode: "insensitive" } },
      { business: { businessName: { contains: s, mode: "insensitive" } } },
    ];
  }

  const members = await db.member.findMany({
    where: whereClause,
    include: {
      chapter: true,
      business: true,
      roles: {
        include: {
          role: true,
        },
      },
      givenReferrals: true,
      receivedReferrals: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return members.map((m) => {
    let currentRole = "MEMBER";
    const foundRole = m.roles?.find((r) => ["PRESIDENT", "VICE_PRESIDENT", "TREASURER"].includes(r.role.name))?.role.name;
    if (foundRole) currentRole = foundRole;
    else if (m.email.includes("president")) currentRole = "PRESIDENT";
    else if (m.email.includes("vp")) currentRole = "VICE_PRESIDENT";
    else if (m.email.includes("treasurer")) currentRole = "TREASURER";

    return {
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phoneNumber || "",
      businessName: m.business?.businessName || "Independent Business",
      industry: m.business?.industry || "Services",
      chapterId: m.chapterId || "",
      chapterName: m.chapter?.name || "Unassigned",
      currentRole,
      status: m.status,
      joinedAt: m.joinedAt?.toISOString() || m.createdAt.toISOString(),
      membershipNumber: m.membershipNumber || `GC-MEM-${m.id.substring(0, 4).toUpperCase()}`,
      referralsGiven: m.givenReferrals.length,
      referralsReceived: m.receivedReferrals.length,
      attendanceRate: 0,
    };
  });
}

/**
 * Change member role within a chapter
 */
export async function changeDirectorMemberRole(data: {
  memberId: string;
  newRole: "MEMBER" | "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  chapterId: string;
}) {
  const role = await db.role.upsert({
    where: { name: data.newRole },
    create: { name: data.newRole, description: `Chapter ${data.newRole}` },
    update: {},
  });

  // If officer role, clear previous holder
  if (data.newRole !== "MEMBER") {
    const existingOfficers = await db.member.findMany({
      where: { chapterId: data.chapterId, id: { not: data.memberId } },
      include: { roles: { include: { role: true } } },
    });
    for (const eco of existingOfficers) {
      const existing = eco.roles.find((r) => r.role.name === data.newRole);
      if (existing) {
        await db.memberRole.delete({ where: { id: existing.id } }).catch(() => {});
      }
    }
  }

  await db.memberRole.upsert({
    where: {
      memberId_roleId: {
        memberId: data.memberId,
        roleId: role.id,
      },
    },
    create: {
      memberId: data.memberId,
      roleId: role.id,
    },
    update: {},
  });

  revalidatePath("/dashboard/director/members");
  revalidatePath("/dashboard/director");
  return { success: true };
}

/**
 * Add a new member directly to a chapter
 */
export async function addDirectorMember(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  chapterId: string;
  businessName?: string;
  industry?: string;
}) {
  const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const newMember = await db.member.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      chapterId: data.chapterId,
      organizationId: chapter.organizationId,
      status: MemberStatus.ACTIVE,
      membershipNumber: `GC-${chapter.chapterCode || "CHP"}-${Math.floor(100 + Math.random() * 900)}`,
      joinedAt: new Date(),
      business: {
        create: {
          businessName: data.businessName || `${data.firstName}'s Business`,
          industry: data.industry || "General Services",
        },
      },
    },
  });

  revalidatePath("/dashboard/director/members");
  revalidatePath("/dashboard/director");
  return newMember;
}

/**
 * Get Leadership Workspace
 */
export async function getDirectorLeadership() {
  await ensureSampleDirectorData();
  const chapters = await db.chapter.findMany({
    include: {
      members: {
        include: {
          business: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  return chapters.map((c) => {
    const president = c.members.find((m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president"));
    const vp = c.members.find((m) => m.roles.some((r) => r.role.name === "VICE_PRESIDENT") || m.email.includes("vp"));
    const treasurer = c.members.find((m) => m.roles.some((r) => r.role.name === "TREASURER") || m.email.includes("treasurer"));

    return {
      chapterId: c.id,
      chapterName: c.name,
      chapterCode: c.chapterCode || `CHP-${c.id.substring(0, 4)}`,
      region: c.region || "Primary Region",
      president: president
        ? { id: president.id, name: `${president.firstName} ${president.lastName}`, email: president.email, business: president.business?.businessName }
        : null,
      vicePresident: vp
        ? { id: vp.id, name: `${vp.firstName} ${vp.lastName}`, email: vp.email, business: vp.business?.businessName }
        : null,
      treasurer: treasurer
        ? { id: treasurer.id, name: `${treasurer.firstName} ${treasurer.lastName}`, email: treasurer.email, business: treasurer.business?.businessName }
        : null,
      vacancies: (!president ? 1 : 0) + (!vp ? 1 : 0) + (!treasurer ? 1 : 0),
    };
  });
}

/**
 * Assign Leadership Position
 */
export async function assignDirectorLeadership(data: {
  chapterId: string;
  position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  memberId: string;
}) {
  const member = await db.member.findUnique({
    where: { id: data.memberId },
    include: { roles: { include: { role: true } } },
  });
  if (!member) throw new Error("Member not found");

  const targetRole = await db.role.upsert({
    where: { name: data.position },
    create: { name: data.position, description: `Chapter ${data.position}` },
    update: {},
  });

  const existingChapterOfficers = await db.member.findMany({
    where: { chapterId: data.chapterId, id: { not: data.memberId } },
    include: { roles: { include: { role: true } } },
  });
  for (const eco of existingChapterOfficers) {
    const existing = eco.roles.find((r) => r.role.name === data.position);
    if (existing) {
      await db.memberRole.delete({ where: { id: existing.id } }).catch(() => {});
    }
  }

  await db.memberRole.upsert({
    where: {
      memberId_roleId: {
        memberId: data.memberId,
        roleId: targetRole.id,
      },
    },
    create: {
      memberId: data.memberId,
      roleId: targetRole.id,
    },
    update: {},
  });

  await db.auditLog.create({
    data: {
      action: "LEADERSHIP_ASSIGNMENT",
      entity: "Chapter",
      entityId: data.chapterId,
      newValue: { position: data.position, memberId: data.memberId, memberName: `${member.firstName} ${member.lastName}` },
      who: "Director User",
    },
  });

  revalidatePath("/dashboard/director/leadership");
  revalidatePath("/dashboard/director");
  return { success: true, chapterId: data.chapterId, position: data.position, memberId: data.memberId };
}

/**
 * Get Visitors across assigned chapters
 */
export async function getDirectorVisitors(params?: { chapterId?: string; status?: string }) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(params?.chapterId);

  const whereClause: any = {};
  if (effectiveChapterId) {
    whereClause.chapterId = effectiveChapterId;
  }
  if (params?.status && params.status !== "all") {
    whereClause.status = params.status as VisitorStatus;
  }

  const visitors = await db.visitor.findMany({
    where: whereClause,
    include: {
      chapter: true,
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
    phone: v.phone || "N/A",
    company: v.company || "Independent Business",
    industry: v.industry || "General",
    chapterId: v.chapterId,
    chapterName: v.chapter.name,
    invitedBy: v.invitedBy ? `${v.invitedBy.firstName} ${v.invitedBy.lastName}` : "Direct Lead",
    visitDate: v.visitDate.toISOString(),
    status: v.status,
    notes: v.notes || "",
  }));
}

/**
 * Convert Visitor to Member
 */
export async function convertDirectorVisitorToMember(data: {
  visitorId: string;
  chapterId: string;
  membershipNumber?: string;
}) {
  const visitor = await db.visitor.findUnique({ where: { id: data.visitorId } });
  if (!visitor) throw new Error("Visitor not found");

  const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new Error("Chapter not found");

  const newMember = await db.member.create({
    data: {
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      email: visitor.email,
      phoneNumber: visitor.phone,
      chapterId: data.chapterId,
      organizationId: chapter.organizationId,
      status: MemberStatus.ACTIVE,
      membershipNumber: data.membershipNumber || `GC-CONV-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedAt: new Date(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      business: {
        create: {
          businessName: visitor.company || `${visitor.firstName}'s Company`,
          industry: visitor.industry || "General Services",
        },
      },
    },
  });

  await db.visitor.update({
    where: { id: data.visitorId },
    data: {
      status: VisitorStatus.CONVERTED,
      convertedToMemberAt: new Date(),
    },
  });

  revalidatePath("/dashboard/director/visitors");
  revalidatePath("/dashboard/admin/visitors");
  revalidatePath("/dashboard/leadership/visitors");
  return newMember;
}

/**
 * Get Meetings across assigned chapters
 */
export async function getDirectorMeetings(chapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(chapterId);

  const meetings = await db.meeting.findMany({
    where: effectiveChapterId ? { chapterId: effectiveChapterId } : {},
    include: {
      chapter: true,
      attendances: true,
    },
    orderBy: { date: "desc" },
  });

  return meetings.map((m) => ({
    id: m.id,
    title: m.title || `${m.chapter.name} Weekly Meeting`,
    chapterId: m.chapterId,
    chapterName: m.chapter.name,
    meetingNumber: m.meetingNumber || "M-101",
    date: m.date.toISOString(),
    location: m.location || m.chapter.meetingLocation || "Chapter Hall",
    speaker: m.speaker || "Featured Chapter Member",
    meetingType: m.meetingType || "HYBRID",
    status: m.status,
    attendanceCount: m.attendances.length,
    agenda: m.agenda || "Standard structured networking agenda.",
  }));
}

/**
 * Get Attendance metrics & logs
 */
export async function getDirectorAttendance(chapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(chapterId);

  const chapters = await db.chapter.findMany({
    where: effectiveChapterId ? { id: effectiveChapterId } : {},
    include: {
      meetings: {
        include: {
          attendances: {
            include: {
              member: true,
            },
          },
        },
      },
      members: true,
    },
  });

  const records = [];
  for (const c of chapters) {
    const totalMem = c.members.length;
    for (const m of c.meetings) {
      const presentCount = m.attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
      const absentCount = m.attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;
      const subCount = m.attendances.filter((a) => a.status === AttendanceStatus.SUBSTITUTE).length;
      const excusedCount = m.attendances.filter((a) => a.status === AttendanceStatus.EXCUSED).length;
      const rate = totalMem > 0 ? Math.round(((presentCount + subCount) / totalMem) * 100) : 0;

      records.push({
        id: m.id,
        meetingTitle: m.title || `${c.name} Weekly Meeting`,
        chapterId: c.id,
        chapterName: c.name,
        date: m.date.toISOString(),
        totalMembers: totalMem,
        present: presentCount,
        absent: absentCount,
        substitute: subCount,
        excused: excusedCount,
        attendancePercentage: rate,
      });
    }
  }

  return records;
}

/**
 * Get Referrals Pipeline & Business Value
 */
export async function getDirectorReferrals(chapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(chapterId);

  const referrals = await db.referral.findMany({
    where: effectiveChapterId ? { chapterId: effectiveChapterId } : {},
    include: {
      chapter: true,
      fromMember: true,
      toMember: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return referrals.map((r) => ({
    id: r.id,
    title: r.referralName,
    fromMemberName: `${r.fromMember.firstName} ${r.fromMember.lastName}`,
    toMemberName: `${r.toMember.firstName} ${r.toMember.lastName}`,
    chapterId: r.chapterId,
    chapterName: r.chapter.name,
    status: r.status,
    value: Number(r.value) || 0,
    createdDate: r.createdAt.toISOString(),
    closedDate: r.closedDate?.toISOString() || null,
  }));
}

/**
 * Get One-to-Ones networking activity
 */
export async function getDirectorOneToOnes(chapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(chapterId);

  const oneToOnes = await db.oneToOne.findMany({
    where: effectiveChapterId
      ? {
          OR: [
            { initiator: { chapterId: effectiveChapterId } },
            { receiver: { chapterId: effectiveChapterId } },
          ],
        }
      : undefined,
    include: {
      initiator: { include: { chapter: true } },
      receiver: { include: { chapter: true } },
    },
    orderBy: { date: "desc" },
  });

  return oneToOnes.map((o) => ({
    id: o.id,
    initiatorName: `${o.initiator.firstName} ${o.initiator.lastName}`,
    receiverName: `${o.receiver.firstName} ${o.receiver.lastName}`,
    chapterName: o.initiator.chapter?.name || "Assigned Chapter",
    date: o.date.toISOString(),
    duration: o.duration || 60,
    location: o.location || "Virtual / Coffee",
    status: o.status,
    outcome: o.outcome || "1-to-1 networking session.",
  }));
}

/**
 * Get Director Payments & Finance Summary
 */
export async function getDirectorPayments(chapterId?: string) {
  await ensureSampleDirectorData();
  const effectiveChapterId = await getEffectiveChapterId(chapterId);

  let memberIds: string[] | undefined = undefined;
  if (effectiveChapterId) {
    const chapterMembers = await db.member.findMany({
      where: { chapterId: effectiveChapterId },
      select: { id: true },
    });
    memberIds = chapterMembers.map((m) => m.id);
  }

  const invoices = await db.invoice.findMany({
    where: memberIds ? { memberId: { in: memberIds } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const memberIdList = invoices.map((i) => i.memberId).filter((id): id is string => !!id);
  const members = memberIdList.length > 0
    ? await db.member.findMany({
        where: { id: { in: memberIdList } },
        include: { chapter: true },
      })
    : [];
  const memberMap = new Map(members.map((m) => [m.id, m]));

  return invoices.map((inv) => {
    const m = inv.memberId ? memberMap.get(inv.memberId) : null;
    return {
      id: inv.invoiceNumber || `INV-${inv.id.substring(0, 6)}`,
      memberName: m ? `${m.firstName} ${m.lastName}` : "Member",
      chapterName: m?.chapter?.name || "Assigned Chapter",
      amount: Number(inv.total) || 0,
      currency: "INR",
      status: inv.status,
      dueDate: inv.dueDate ? inv.dueDate.toISOString() : inv.createdAt.toISOString(),
      paymentMethod: "Online UPI / Net Banking",
      reference: inv.id,
    };
  });
}

/**
 * Send Chapter Notification / Announcement
 */
export async function sendDirectorChapterNotification(data: {
  title: string;
  body: string;
  chapterId: string;
  targetAudience: "ALL" | "LEADERSHIP" | "MEMBERS";
}) {
  const members = await db.member.findMany({
    where: data.chapterId !== "all" ? { chapterId: data.chapterId } : {},
  });

  for (const m of members) {
    if (m.userId) {
      await db.notification.create({
        data: {
          userId: m.userId,
          title: data.title,
          body: data.body,
          type: "IN_APP",
        },
      });
    }
  }

  return { success: true, count: members.length };
}

/**
 * Get Director Reports & Analytics Data
 */
export async function getDirectorReports(chapterId?: string) {
  const overview = await getDirectorOverview(chapterId);
  return {
    kpis: overview.kpis,
    chapters: overview.chapters,
    monthlyPerformance: [],
  };
}

/**
 * Get Comprehensive Director Chapter Detail
 */
export async function getDirectorChapterDetail(chapterId: string) {
  await ensureSampleDirectorData();

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: {
      members: {
        include: {
          business: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
      visitors: {
        include: {
          invitedBy: true,
        },
        orderBy: { visitDate: "desc" },
      },
      meetings: {
        include: {
          attendances: {
            include: {
              member: true,
            },
          },
        },
        orderBy: { date: "desc" },
      },
      referrals: {
        include: {
          fromMember: true,
          toMember: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!chapter) return null;

  const president = chapter.members.find((m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president"));
  const vp = chapter.members.find((m) => m.roles.some((r) => r.role.name === "VICE_PRESIDENT") || m.email.includes("vp"));
  const treasurer = chapter.members.find((m) => m.roles.some((r) => r.role.name === "TREASURER") || m.email.includes("treasurer"));

  const vacancies = (!president ? 1 : 0) + (!vp ? 1 : 0) + (!treasurer ? 1 : 0);

  const convertedVisitors = chapter.visitors.filter((v) => v.status === VisitorStatus.CONVERTED).length;
  const totalVisitors = chapter.visitors.length;
  const visitorConversion = totalVisitors > 0 ? Math.round((convertedVisitors / totalVisitors) * 100) : 0;

  const closedWon = chapter.referrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const closedBusiness = closedWon.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  const totalAtt = chapter.meetings.flatMap((m) => m.attendances);
  const presentAtt = totalAtt.filter((a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.SUBSTITUTE).length;
  const attendanceRate = totalAtt.length > 0 ? Math.round((presentAtt / totalAtt.length) * 100) : 0;

  const chapterMembers = await db.member.findMany({
    where: { chapterId },
    select: { id: true },
  });
  const chMemberIds = chapterMembers.map((m) => m.id);

  const invoices = await db.invoice.findMany({
    where: { memberId: { in: chMemberIds } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const memberMap = new Map(chapter.members.map((m) => [m.id, m]));

  return {
    id: chapter.id,
    name: chapter.name,
    chapterCode: chapter.chapterCode || `CHP-${chapter.id.substring(0, 4)}`,
    region: chapter.region || "Primary Region",
    location: chapter.meetingLocation || "Main Conference Center",
    meetingDay: chapter.meetingDay || "Wednesday",
    meetingTime: chapter.meetingTime || "07:30 AM",
    isActive: chapter.isActive,
    status: (vacancies === 0 ? "HEALTHY" : "NEEDS_ATTENTION") as "HEALTHY" | "NEEDS_ATTENTION",
    president: president
      ? { id: president.id, name: `${president.firstName} ${president.lastName}`, email: president.email, businessName: president.business?.businessName }
      : null,
    vicePresident: vp
      ? { id: vp.id, name: `${vp.firstName} ${vp.lastName}`, email: vp.email, businessName: vp.business?.businessName }
      : null,
    treasurer: treasurer
      ? { id: treasurer.id, name: `${treasurer.firstName} ${treasurer.lastName}`, email: treasurer.email, businessName: treasurer.business?.businessName }
      : null,
    vacancies,
    memberCount: chapter.members.length,
    attendanceRate,
    visitorConversion,
    closedBusiness,
    members: chapter.members.map((m) => {
      let currentRole = "MEMBER";
      const foundRole = m.roles?.find((r) => ["PRESIDENT", "VICE_PRESIDENT", "TREASURER"].includes(r.role.name))?.role.name;
      if (foundRole) currentRole = foundRole;
      else if (m.email.includes("president")) currentRole = "PRESIDENT";
      else if (m.email.includes("vp")) currentRole = "VICE_PRESIDENT";
      else if (m.email.includes("treasurer")) currentRole = "TREASURER";

      return {
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phoneNumber || "",
        businessName: m.business?.businessName || "Independent Business",
        industry: m.business?.industry || "Services",
        currentRole,
        status: m.status,
        joinedAt: m.joinedAt?.toISOString() || m.createdAt.toISOString(),
      };
    }),
    meetings: chapter.meetings.map((m) => ({
      id: m.id,
      title: m.title || `${chapter.name} Weekly Meeting`,
      date: m.date.toISOString(),
      location: m.location || chapter.meetingLocation || "Chapter Hall",
      meetingType: m.meetingType || "HYBRID",
      status: m.status,
      speaker: m.speaker || "Featured Member Speaker",
      attendanceCount: m.attendances.length,
    })),
    visitors: chapter.visitors.map((v) => ({
      id: v.id,
      name: `${v.firstName} ${v.lastName}`,
      company: v.company || "Independent Business",
      industry: v.industry || "General Services",
      email: v.email,
      phone: v.phone || "N/A",
      invitedBy: v.invitedBy ? `${v.invitedBy.firstName} ${v.invitedBy.lastName}` : "Direct Guest",
      visitDate: v.visitDate.toISOString(),
      status: v.status,
    })),
    referrals: chapter.referrals.map((r) => ({
      id: r.id,
      title: r.referralName,
      fromMemberName: `${r.fromMember.firstName} ${r.fromMember.lastName}`,
      toMemberName: `${r.toMember.firstName} ${r.toMember.lastName}`,
      value: Number(r.value) || 0,
      status: r.status,
      createdDate: r.createdAt.toISOString(),
    })),
    payments: invoices.map((inv) => {
      const m = inv.memberId ? memberMap.get(inv.memberId) : null;
      return {
        id: inv.invoiceNumber || `INV-${inv.id.substring(0, 6)}`,
        memberName: m ? `${m.firstName} ${m.lastName}` : "Member",
        amount: Number(inv.total) || 0,
        currency: "INR",
        status: inv.status,
        reference: inv.id,
        paymentMethod: "Online UPI / Net Banking",
        dueDate: inv.dueDate ? inv.dueDate.toISOString() : inv.createdAt.toISOString(),
      };
    }),
  };
}
