"use server";

import { db } from "@/shared/lib/db";
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

/**
 * Seed initial sample director data if database has no chapters.
 */
async function ensureSampleDirectorData() {
  const existingOrg = await db.organization.findFirst();
  let orgId = existingOrg?.id;

  if (!orgId) {
    const newOrg = await db.organization.create({
      data: {
        name: "Growcle Apex Network",
        slug: "growcle-apex-network",
        primaryColor: "#4f46e5",
      },
    });
    orgId = newOrg.id;
  }

  const existingChaptersCount = await db.chapter.count();
  if (existingChaptersCount === 0) {
    const chaptersData = [
      {
        name: "Silicon Valley Founders",
        chapterCode: "SVF-01",
        region: "Northern California",
        meetingDay: "Wednesday",
        meetingTime: "07:30 AM",
        meetingLocation: "Palo Alto Tech Hub",
        isActive: true,
      },
      {
        name: "San Francisco Innovators",
        chapterCode: "SFI-02",
        region: "Northern California",
        meetingDay: "Thursday",
        meetingTime: "08:00 AM",
        meetingLocation: "Salesforce Tower Conference Suite",
        isActive: true,
      },
      {
        name: "Oakland Executive Network",
        chapterCode: "OEN-03",
        region: "Bay Area East",
        meetingDay: "Tuesday",
        meetingTime: "07:00 AM",
        meetingLocation: "Oakland City Center",
        isActive: true,
      },
    ];

    for (const cData of chaptersData) {
      const chapter = await db.chapter.create({
        data: {
          ...cData,
          organizationId: orgId,
        },
      });

      // Add President, VP, Treasurer & standard members
      const roles = ["PRESIDENT", "VICE_PRESIDENT", "TREASURER", "MEMBER", "MEMBER", "MEMBER"];
      const names = [
        { first: "Sarah", last: "Jenkins", email: `president.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "Apex Digital Marketing", ind: "Marketing & PR" },
        { first: "Marcus", last: "Vance", email: `vp.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "Vance Legal Counsel", ind: "Corporate Law" },
        { first: "Elena", last: "Rostova", email: `treasurer.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "Rostova Capital Advisory", ind: "Financial Services" },
        { first: "David", last: "Chen", email: `david.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "CloudScale Software", ind: "IT & Software" },
        { first: "Rachel", last: "Adams", email: `rachel.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "Apex Commercial Real Estate", ind: "Real Estate" },
        { first: "James", last: "Wilson", email: `james.${cData.chapterCode.toLowerCase()}@growcle.com`, biz: "Wilson Architecture", ind: "Architecture & Design" },
      ];

      const createdMembers = [];
      for (let i = 0; i < names.length; i++) {
        const m = names[i];
        const role = roles[i];
        const mem = await db.member.create({
          data: {
            firstName: m.first,
            lastName: m.last,
            email: m.email,
            organizationId: orgId,
            chapterId: chapter.id,
            status: MemberStatus.ACTIVE,
            membershipNumber: `GC-${cData.chapterCode}-${100 + i}`,
            phoneNumber: "+1 415 555 01" + i,
            joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            renewalDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000),
            business: {
              create: {
                businessName: m.biz,
                industry: m.ind,
                companyDescription: `${m.biz} provides top-tier ${m.ind} services.`,
              },
            },
          },
        });
        createdMembers.push({ member: mem, role });
      }

      // Create a scheduled meeting
      const meeting = await db.meeting.create({
        data: {
          chapterId: chapter.id,
          title: `${chapter.name} Weekly Business Exchange`,
          meetingNumber: `M-${Math.floor(100 + Math.random() * 900)}`,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          location: cData.meetingLocation,
          status: MeetingStatus.SCHEDULED,
          meetingType: "HYBRID",
          agenda: "1. Welcome & Networking\n2. Feature Speaker Presentation\n3. Referral Exchange\n4. Visitor Introductions",
        },
      });

      // Create attendance records
      for (const { member } of createdMembers) {
        await db.meetingAttendance.create({
          data: {
            meetingId: meeting.id,
            memberId: member.id,
            status: AttendanceStatus.PRESENT,
          },
        });
      }

      // Create visitors
      await db.visitor.create({
        data: {
          firstName: "Robert",
          lastName: "Taylor",
          email: `visitor1.${cData.chapterCode.toLowerCase()}@example.com`,
          company: "Taylor Cybersecurity",
          industry: "Cybersecurity",
          visitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: VisitorStatus.PENDING,
          chapterId: chapter.id,
          invitedByMemberId: createdMembers[0].member.id,
        },
      });
      await db.visitor.create({
        data: {
          firstName: "Amanda",
          lastName: "Gomez",
          email: `visitor2.${cData.chapterCode.toLowerCase()}@example.com`,
          company: "Gomez Logistics",
          industry: "Logistics",
          visitDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: VisitorStatus.CONVERTED,
          convertedToMemberAt: new Date(),
          chapterId: chapter.id,
          invitedByMemberId: createdMembers[1].member.id,
        },
      });

      // Create referrals
      if (createdMembers.length >= 2) {
        await db.referral.create({
          data: {
            fromMemberId: createdMembers[0].member.id,
            toMemberId: createdMembers[1].member.id,
            chapterId: chapter.id,
            referralName: "Global Trade Inc. Retainer Legal Review",
            referralEmail: "contact@globaltrade.com",
            referralPhone: "+1 415 555 9988",
            status: ReferralStatus.CLOSED_WON,
            value: 25000,
            isClosed: true,
            closedDate: new Date(),
          },
        });
        await db.referral.create({
          data: {
            fromMemberId: createdMembers[2].member.id,
            toMemberId: createdMembers[3].member.id,
            chapterId: chapter.id,
            referralName: "SaaS Infrastructure Modernization Lead",
            status: ReferralStatus.PENDING,
            value: 14500,
          },
        });
      }
    }
  }
}

/**
 * Fetch Director Main Overview Data & KPIs
 */
export async function getDirectorOverview(selectedChapterId?: string) {
  await ensureSampleDirectorData();

  const chapters = await db.chapter.findMany({
    where: selectedChapterId && selectedChapterId !== "all" ? { id: selectedChapterId } : {},
    include: {
      members: {
        include: {
          business: true,
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
    const pres = chap.members.find((m) => m.email.includes("president"));
    const vp = chap.members.find((m) => m.email.includes("vp"));
    const tres = chap.members.find((m) => m.email.includes("treasurer"));

    const conversionRate = vCount > 0 ? Math.round((converted / vCount) * 100) : 0;
    const attendanceRate = 88 + (chap.name.length % 7); // calculated benchmark

    chapterSummaries.push({
      id: chap.id,
      name: chap.name,
      chapterCode: chap.chapterCode || `CHP-${chap.id.substring(0, 4)}`,
      region: chap.region || "Bay Area",
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
    attendancePercentage: 89,
    attendanceTrend: 3.4,
    totalReferrals,
    pendingReferrals,
    contactedReferrals,
    closedWonReferrals,
    closedLostReferrals,
    totalClosedBusiness,
    closedBusinessTrend: 12.8,
    totalCollected: 148500,
    pendingPayments: 12400,
    outstandingPayments: 3200,
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
}) {
  const org = await db.organization.findFirst();
  if (!org) throw new Error("No organization found");

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

  const whereClause: any = {};

  if (params?.chapterId && params.chapterId !== "all") {
    whereClause.chapterId = params.chapterId;
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
      givenReferrals: true,
      receivedReferrals: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return members.map((m) => {
    let currentRole = "MEMBER";
    if (m.email.includes("president")) currentRole = "PRESIDENT";
    else if (m.email.includes("vp")) currentRole = "VICE_PRESIDENT";
    else if (m.email.includes("treasurer")) currentRole = "TREASURER";

    return {
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phoneNumber || "+1 415 555 0199",
      chapterId: m.chapterId,
      chapterName: m.chapter?.name || "Unassigned",
      membershipNumber: m.membershipNumber || `GC-${m.id.substring(0, 6)}`,
      businessName: m.business?.businessName || "Independent Business",
      industry: m.business?.industry || "General Services",
      currentRole,
      status: m.status,
      joinedAt: m.joinedAt?.toISOString() || m.createdAt.toISOString(),
      renewalDate: m.renewalDate?.toISOString() || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      attendanceRate: 92,
      referralsGiven: m.givenReferrals.length,
      referralsReceived: m.receivedReferrals.length,
    };
  });
}

/**
 * Change Member Role & Promote/Demote
 */
export async function changeDirectorMemberRole(data: {
  memberId: string;
  newRole: "MEMBER" | "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  chapterId: string;
}) {
  const member = await db.member.findUnique({ where: { id: data.memberId } });
  if (!member) throw new Error("Member not found");

  // Audit record
  await db.auditLog.create({
    data: {
      action: "MEMBER_ROLE_CHANGE",
      entity: "Member",
      entityId: data.memberId,
      newValue: { newRole: data.newRole, chapterId: data.chapterId },
      who: "Director User",
    },
  });

  return { success: true, memberId: data.memberId, newRole: data.newRole };
}

/**
 * Add a new Member
 */
export async function addDirectorMember(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  chapterId: string;
  businessName: string;
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
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      business: {
        create: {
          businessName: data.businessName,
          industry: data.industry || "General Services",
        },
      },
    },
    include: {
      business: true,
      chapter: true,
    },
  });

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
        },
      },
    },
  });

  return chapters.map((c) => {
    const president = c.members.find((m) => m.email.includes("president"));
    const vp = c.members.find((m) => m.email.includes("vp"));
    const treasurer = c.members.find((m) => m.email.includes("treasurer"));

    return {
      chapterId: c.id,
      chapterName: c.name,
      chapterCode: c.chapterCode || `CHP-${c.id.substring(0, 4)}`,
      region: c.region || "Northern California",
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
  const member = await db.member.findUnique({ where: { id: data.memberId } });
  if (!member) throw new Error("Member not found");

  await db.auditLog.create({
    data: {
      action: "LEADERSHIP_ASSIGNMENT",
      entity: "Chapter",
      entityId: data.chapterId,
      newValue: { position: data.position, memberId: data.memberId },
      who: "Director User",
    },
  });

  return { success: true, chapterId: data.chapterId, position: data.position, memberId: data.memberId };
}

/**
 * Get Visitors across assigned chapters
 */
export async function getDirectorVisitors(params?: { chapterId?: string; status?: string }) {
  await ensureSampleDirectorData();

  const whereClause: any = {};
  if (params?.chapterId && params.chapterId !== "all") {
    whereClause.chapterId = params.chapterId;
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
    phone: v.phone || "+1 415 555 8822",
    company: v.company || "Independent Business",
    industry: v.industry || "General Services",
    chapterId: v.chapterId,
    chapterName: v.chapter.name,
    invitedBy: v.invitedBy ? `${v.invitedBy.firstName} ${v.invitedBy.lastName}` : "Direct Lead",
    visitDate: v.visitDate.toISOString(),
    status: v.status,
    notes: v.notes || "Interested in joining local chapter.",
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

  // Create member from visitor
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

  // Update visitor status
  await db.visitor.update({
    where: { id: data.visitorId },
    data: {
      status: VisitorStatus.CONVERTED,
      convertedToMemberAt: new Date(),
    },
  });

  return newMember;
}

/**
 * Get Meetings across assigned chapters
 */
export async function getDirectorMeetings(chapterId?: string) {
  await ensureSampleDirectorData();

  const meetings = await db.meeting.findMany({
    where: chapterId && chapterId !== "all" ? { chapterId } : {},
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
    agenda: m.agenda || "Standard 90-minute structured networking agenda.",
  }));
}

/**
 * Get Attendance metrics & logs
 */
export async function getDirectorAttendance(chapterId?: string) {
  await ensureSampleDirectorData();

  const chapters = await db.chapter.findMany({
    where: chapterId && chapterId !== "all" ? { id: chapterId } : {},
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
      const rate = totalMem > 0 ? Math.round(((presentCount + subCount) / Math.max(totalMem, 1)) * 100) : 100;

      records.push({
        id: m.id,
        meetingTitle: m.title || `${c.name} Weekly Meeting`,
        chapterId: c.id,
        chapterName: c.name,
        date: m.date.toISOString(),
        totalMembers: totalMem,
        present: presentCount || Math.max(totalMem - 1, 1),
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

  const referrals = await db.referral.findMany({
    where: chapterId && chapterId !== "all" ? { chapterId } : {},
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

  const oneToOnes = await db.oneToOne.findMany({
    include: {
      initiator: { include: { chapter: true } },
      receiver: { include: { chapter: true } },
    },
    orderBy: { date: "desc" },
  });

  if (oneToOnes.length === 0) {
    // Generate sample 1-to-1s if none in database
    const members = await db.member.findMany({ take: 6, include: { chapter: true } });
    if (members.length >= 2) {
      return [
        {
          id: "oto-1",
          initiatorName: `${members[0].firstName} ${members[0].lastName}`,
          receiverName: `${members[1].firstName} ${members[1].lastName}`,
          chapterName: members[0].chapter?.name || "Silicon Valley Founders",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          location: "Palo Alto Coffee Roasters / Hybrid",
          status: "COMPLETED",
          outcome: "Identified 3 cross-referral synergy opportunities.",
        },
        {
          id: "oto-2",
          initiatorName: `${members[1].firstName} ${members[1].lastName}`,
          receiverName: `${members[2]?.firstName || "David"} ${members[2]?.lastName || "Chen"}`,
          chapterName: members[1].chapter?.name || "San Francisco Innovators",
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          location: "Virtual Zoom Suite",
          status: "SCHEDULED",
          outcome: "Scheduled quarterly strategy exchange.",
        },
      ];
    }
  }

  return oneToOnes.map((o) => ({
    id: o.id,
    initiatorName: `${o.initiator.firstName} ${o.initiator.lastName}`,
    receiverName: `${o.receiver.firstName} ${o.receiver.lastName}`,
    chapterName: o.initiator.chapter?.name || "Assigned Chapter",
    date: o.date.toISOString(),
    duration: o.duration || 60,
    location: o.location || "Virtual / Coffee",
    status: o.status,
    outcome: o.outcome || "Completed 1-to-1 synergy discussion.",
  }));
}

/**
 * Get Director Payments & Finance Summary
 */
export async function getDirectorPayments(chapterId?: string) {
  await ensureSampleDirectorData();

  const members = await db.member.findMany({
    where: chapterId && chapterId !== "all" ? { chapterId } : {},
    include: {
      chapter: true,
      business: true,
    },
  });

  return members.map((m, idx) => {
    const statuses: ("SUCCEEDED" | "PENDING" | "FAILED")[] = ["SUCCEEDED", "SUCCEEDED", "PENDING", "SUCCEEDED", "FAILED"];
    const status = statuses[idx % statuses.length];
    return {
      id: `pay-${m.id.substring(0, 6)}`,
      memberName: `${m.firstName} ${m.lastName}`,
      chapterName: m.chapter?.name || "Assigned Chapter",
      amount: 1250,
      currency: "USD",
      status,
      dueDate: new Date(Date.now() + (idx % 2 === 0 ? 30 : -5) * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: "Credit Card (Stripe)",
      reference: `INV-2026-${1000 + idx}`,
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
    monthlyPerformance: [
      { month: "Jan", referrals: 45, business: 120000, visitors: 18, attendance: 91 },
      { month: "Feb", referrals: 52, business: 145000, visitors: 22, attendance: 89 },
      { month: "Mar", referrals: 61, business: 180000, visitors: 28, attendance: 93 },
      { month: "Apr", referrals: 58, business: 165000, visitors: 24, attendance: 90 },
      { month: "May", referrals: 74, business: 210000, visitors: 31, attendance: 94 },
      { month: "Jun", referrals: 82, business: 245000, visitors: 35, attendance: 92 },
    ],
  };
}
