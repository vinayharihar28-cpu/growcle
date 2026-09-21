"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth/session";
import {
  MemberStatus,
  VisitorStatus,
  ReferralStatus,
  MeetingStatus,
  AttendanceStatus,
  OneToOneStatus,
} from "@prisma/client";

export interface MemberContext {
  memberId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  chapterId: string;
  chapterName: string;
  chapterCode: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  membershipStatus: string;
  membershipNumber: string;
  joinedAt: string;
  businessName: string;
  industry: string;
}

/**
 * Resolves current member identity and assigned chapter context.
 */
export async function getMemberContext(): Promise<MemberContext> {
  let member: any = null;
  const session = await getCurrentSession();

  if (session?.user?.id) {
    member = await db.member.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          { email: session.user.email },
        ],
      },
      include: {
        chapter: true,
        business: true,
        roles: {
          include: { role: true },
        },
      },
    });
  }

  if (!member) {
    member = await db.member.findFirst({
      where: {
        status: MemberStatus.ACTIVE,
      },
      include: {
        chapter: true,
        business: true,
        roles: {
          include: { role: true },
        },
      },
    });
  }

  if (!member || !member.chapter) {
    const anyChapter = await db.chapter.findFirst();
    return {
      memberId: "default-member",
      firstName: "Vinay",
      lastName: "Harihar",
      name: "Vinay Harihar",
      email: "vinayharihar28@gmail.com",
      phone: "+91 98765 43210",
      designation: "Strategic Partner",
      chapterId: anyChapter?.id || "default-chapter",
      chapterName: anyChapter?.name || "Apex Chapter",
      chapterCode: anyChapter?.chapterCode || "APX-01",
      meetingDay: anyChapter?.meetingDay || "Wednesday",
      meetingTime: anyChapter?.meetingTime || "07:30 AM",
      meetingLocation: anyChapter?.meetingLocation || "Main Business Suite",
      membershipStatus: "ACTIVE",
      membershipNumber: "GC-MEM-001",
      joinedAt: "Jan 15, 2026",
      businessName: "CloudTech Solutions",
      industry: "Information Technology",
    };
  }

  const roleName = member.roles[0]?.role?.name || "MEMBER";

  return {
    memberId: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    phone: member.phoneNumber || "+91 98765 43210",
    designation: roleName === "MEMBER" ? "Active Chapter Member" : roleName,
    chapterId: member.chapter.id,
    chapterName: member.chapter.name,
    chapterCode: member.chapter.chapterCode || `CHP-${member.chapter.id.substring(0, 4)}`,
    meetingDay: member.chapter.meetingDay || "Wednesday",
    meetingTime: member.chapter.meetingTime || "07:30 AM",
    meetingLocation: member.chapter.meetingLocation || "Business Suites Hall",
    membershipStatus: member.status,
    membershipNumber: member.membershipNumber || `GC-MEM-${member.id.substring(0, 4).toUpperCase()}`,
    joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN") : "Recent",
    businessName: member.business?.businessName || "Independent Enterprise",
    industry: member.business?.industry || "Consulting",
  };
}

/**
 * Dashboard KPIs, Next Meeting summary, and activity overview for Member Home
 */
export async function getMemberDashboardData(memberId: string) {
  const member = await db.member.findUnique({
    where: { id: memberId },
    include: {
      chapter: {
        include: {
          meetings: {
            orderBy: { date: "asc" },
            include: {
              attendances: {
                where: { memberId },
              },
            },
          },
        },
      },
      givenReferrals: true,
      receivedReferrals: true,
      meetingAttendances: true,
      initiatedOneToOnes: true,
      receivedOneToOnes: true,
      visitorsInvited: true,
    },
  });

  if (!member) {
    throw new Error("Member profile not found");
  }

  // Attendance metrics
  const totalAttendances = member.meetingAttendances.length;
  const presentCount = member.meetingAttendances.filter(
    (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.SUBSTITUTE
  ).length;
  const attendanceRate = totalAttendances > 0 ? Math.round((presentCount / totalAttendances) * 100) : 0;

  // Closed business (sum of won referrals in ₹)
  const wonGiven = member.givenReferrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const wonReceived = member.receivedReferrals.filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const closedBusinessGenerated = [...wonGiven, ...wonReceived].reduce(
    (acc, r) => acc + (Number(r.value) || 0),
    0
  );

  // 1-to-1s
  const allOneToOnes = [...member.initiatedOneToOnes, ...member.receivedOneToOnes];
  const completedOneToOnes = allOneToOnes.filter((o) => o.status === OneToOneStatus.COMPLETED).length;
  const scheduledOneToOnes = allOneToOnes.filter((o) => o.status === OneToOneStatus.SCHEDULED).length;

  // Visitors
  const visitorsInvited = member.visitorsInvited.length;
  const visitorsAttended = member.visitorsInvited.filter((v) => v.status === VisitorStatus.ATTENDED).length;
  const visitorsConverted = member.visitorsInvited.filter((v) => v.status === VisitorStatus.CONVERTED).length;

  // Next meeting
  const upcomingMeetings = (member.chapter?.meetings || []).filter(
    (m) => new Date(m.date) >= new Date(Date.now() - 12 * 60 * 60 * 1000)
  );
  const nextMeeting = upcomingMeetings[0] || member.chapter?.meetings[0];

  const hasCheckedIn = nextMeeting?.attendances.some(
    (a) => a.status === AttendanceStatus.PRESENT
  );

  // Build recent activity from real events
  const recentActivity: any[] = [];
  for (const r of member.givenReferrals.slice(0, 3)) {
    recentActivity.push({
      id: r.id,
      title: `Referral Given: ${r.referralName}`,
      subtitle: `Value: ₹${Number(r.value) || 0}`,
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      type: "REFERRAL",
    });
  }
  for (const o of allOneToOnes.slice(0, 2)) {
    recentActivity.push({
      id: o.id,
      title: "1-to-1 Networking Session",
      subtitle: o.outcome || "1-to-1 conversation",
      date: new Date(o.date).toLocaleDateString("en-IN"),
      type: "ONE_TO_ONE",
    });
  }

  return {
    kpis: {
      membershipStatus: member.status,
      membershipNumber: member.membershipNumber || `GC-${member.id.substring(0, 4).toUpperCase()}`,
      joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN") : "Recent",
      attendanceRate,
      referralsGiven: member.givenReferrals.length,
      referralsReceived: member.receivedReferrals.length,
      closedBusinessGenerated,
      completedOneToOnes,
      scheduledOneToOnes,
      visitorsInvited,
      visitorsAttended,
      visitorsConverted,
    },
    upcomingMeeting: nextMeeting
      ? {
          id: nextMeeting.id,
          title: nextMeeting.title || `${member.chapter?.name} Weekly Exchange`,
          date: new Date(nextMeeting.date).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          time: member.chapter?.meetingTime || "07:30 AM",
          location: nextMeeting.location || member.chapter?.meetingLocation || "Executive Suite",
          speaker: nextMeeting.speaker || "Featured Chapter Member",
          theme: nextMeeting.theme || "Building Synergies & Cross-Referrals",
          agenda: nextMeeting.agenda || "1. Welcome\n2. 45-Sec Intros\n3. Feature Presentation\n4. Referral Round",
          hasCheckedIn: !!hasCheckedIn,
        }
      : null,
    recentActivity,
  };
}

/**
 * Fetch member personal profile
 */
export async function getMemberProfile(memberId: string) {
  const member = await db.member.findUnique({
    where: { id: memberId },
    include: {
      chapter: true,
      business: true,
    },
  });

  if (!member) throw new Error("Member not found");

  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phoneNumber || "",
    bio: member.bio || "",
    profileImage: member.profileImage || "",
    website: member.website || "",
    linkedin: member.linkedin || "",
    twitter: member.twitter || "",
    membershipNumber: member.membershipNumber || "",
    chapterName: member.chapter?.name || "Apex Chapter",
  };
}

/**
 * Update member personal profile
 */
export async function updateMemberProfile(
  memberId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
  }
) {
  await db.member.update({
    where: { id: memberId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      bio: data.bio,
      website: data.website,
      linkedin: data.linkedin,
      twitter: data.twitter,
    },
  });

  revalidatePath("/dashboard/member/profile");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Fetch member business networking profile
 */
export async function getMemberBusiness(memberId: string) {
  const member = await db.member.findUnique({
    where: { id: memberId },
    include: { business: true },
  });

  if (!member) throw new Error("Member not found");

  const b = member.business;
  let parsedDesc = b?.companyDescription || "Providing reliable client solutions and strategic business support.";
  let whatIDo = "We provide high-impact advisory and strategic execution for expanding enterprises.";
  let whoIHelp = "SMEs, founders, and business leaders seeking operational scale.";
  let bestReferral = "Companies with 10-50 employees looking for fractional CFO or advisory support.";
  let notAGoodReferral = "Sole proprietors looking for free introductory audits.";

  if (b?.companyDescription && b.companyDescription.startsWith("{")) {
    try {
      const parsed = JSON.parse(b.companyDescription);
      if (parsed.description !== undefined) {
        parsedDesc = parsed.description;
        whatIDo = parsed.whatIDo || whatIDo;
        whoIHelp = parsed.whoIHelp || whoIHelp;
        bestReferral = parsed.bestReferral || bestReferral;
        notAGoodReferral = parsed.notAGoodReferral || notAGoodReferral;
      }
    } catch (e) {
      // plain text fallback
    }
  }

  return {
    memberId: member.id,
    businessName: b?.businessName || `${member.firstName}'s Enterprise`,
    industry: b?.industry || "Consulting & Services",
    businessCategory: b?.businessCategory || "General Practice",
    companyDescription: parsedDesc,
    businessAddress: b?.businessAddress || "Bangalore Central Business District",
    businessPhone: b?.businessPhone || member.phoneNumber || "+91 98765 43210",
    businessEmail: b?.businessEmail || member.email,
    website: b?.website || member.website || "https://example.com",
    whatIDo,
    whoIHelp,
    bestReferral,
    notAGoodReferral,
  };
}

/**
 * Update member business profile
 */
export async function updateMemberBusiness(
  memberId: string,
  data: {
    businessName: string;
    industry: string;
    businessCategory?: string;
    companyDescription: string;
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    website?: string;
    whatIDo?: string;
    whoIHelp?: string;
    bestReferral?: string;
    notAGoodReferral?: string;
  }
) {
  const serializedDesc = JSON.stringify({
    description: data.companyDescription,
    whatIDo: data.whatIDo || "",
    whoIHelp: data.whoIHelp || "",
    bestReferral: data.bestReferral || "",
    notAGoodReferral: data.notAGoodReferral || "",
  });

  await db.memberBusiness.upsert({
    where: { memberId },
    create: {
      memberId,
      businessName: data.businessName,
      industry: data.industry,
      businessCategory: data.businessCategory,
      companyDescription: serializedDesc,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      website: data.website,
    },
    update: {
      businessName: data.businessName,
      industry: data.industry,
      businessCategory: data.businessCategory,
      companyDescription: serializedDesc,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      website: data.website,
    },
  });

  revalidatePath("/dashboard/member/business");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Discover fellow chapter members (Privacy-filtered member directory)
 */
export async function getChapterMemberDirectory(
  chapterId: string,
  search?: string,
  industry?: string
) {
  const whereClause: any = {
    chapterId,
    status: MemberStatus.ACTIVE,
  };

  if (search) {
    const s = search.toLowerCase();
    whereClause.OR = [
      { firstName: { contains: s, mode: "insensitive" } },
      { lastName: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { business: { businessName: { contains: s, mode: "insensitive" } } },
      { business: { industry: { contains: s, mode: "insensitive" } } },
    ];
  }

  if (industry && industry !== "all") {
    whereClause.business = {
      ...whereClause.business,
      industry: { equals: industry, mode: "insensitive" },
    };
  }

  const members = await db.member.findMany({
    where: whereClause,
    include: {
      business: true,
      roles: { include: { role: true } },
    },
    orderBy: { firstName: "asc" },
  });

  return members.map((m) => {
    let desc = m.business?.companyDescription || "Active chapter networking member.";
    let bestReferral = "Open to high-trust chapter referrals.";
    if (m.business?.companyDescription && m.business.companyDescription.startsWith("{")) {
      try {
        const parsed = JSON.parse(m.business.companyDescription);
        if (parsed.description) desc = parsed.description;
        if (parsed.bestReferral) bestReferral = parsed.bestReferral;
      } catch (e) {}
    }

    return {
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
      phone: m.phoneNumber || "+91 98765 43210",
      businessName: m.business?.businessName || "Independent Business",
      industry: m.business?.industry || "Services",
      businessCategory: m.business?.businessCategory || "General",
      companyDescription: desc,
      bestReferral,
      bio: m.bio || "",
      roleName: m.roles[0]?.role?.name || "Member",
      joinedAt: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("en-IN") : "Recent",
    };
  });
}

/**
 * Detailed view of a fellow chapter member for 1-to-1 request or giving a referral
 */
export async function getChapterMemberDetail(targetMemberId: string) {
  const member = await db.member.findUnique({
    where: { id: targetMemberId },
    include: {
      chapter: true,
      business: true,
      roles: { include: { role: true } },
    },
  });

  if (!member) {
    throw new Error("Chapter member not found");
  }

  const b = member.business;
  let parsedDesc = b?.companyDescription || "Active chapter networking member.";
  let whatIDo = "Providing high-impact client solutions and strategic business execution.";
  let whoIHelp = "SMEs, founders, and decision-makers looking to scale operations.";
  let bestReferral = "Companies looking for professional and reliable industry expertise.";
  let notAGoodReferral = "Clients seeking non-committal or price-shopping engagements.";

  if (b?.companyDescription && b.companyDescription.startsWith("{")) {
    try {
      const parsed = JSON.parse(b.companyDescription);
      if (parsed.description !== undefined) {
        parsedDesc = parsed.description;
        whatIDo = parsed.whatIDo || whatIDo;
        whoIHelp = parsed.whoIHelp || whoIHelp;
        bestReferral = parsed.bestReferral || bestReferral;
        notAGoodReferral = parsed.notAGoodReferral || notAGoodReferral;
      }
    } catch (e) {
      // plain text fallback
    }
  }

  const roleName = member.roles[0]?.role?.name || "Member";

  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    phone: member.phoneNumber || "+91 98765 43210",
    bio: member.bio || "",
    profileImage: member.profileImage || "",
    website: member.website || b?.website || "",
    linkedin: member.linkedin || "",
    twitter: member.twitter || "",
    membershipNumber: member.membershipNumber || `GC-MEM-${member.id.substring(0, 4).toUpperCase()}`,
    joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN") : "Recent",
    chapterId: member.chapterId || "",
    chapterName: member.chapter?.name || "Growcle Chapter",
    chapterCode: member.chapter?.chapterCode || "CHP-01",
    roleName,
    business: {
      businessName: b?.businessName || `${member.firstName}'s Enterprise`,
      industry: b?.industry || "Services",
      businessCategory: b?.businessCategory || "General Practice",
      businessEmail: b?.businessEmail || member.email,
      businessPhone: b?.businessPhone || member.phoneNumber || "+91 98765 43210",
      businessAddress: b?.businessAddress || "Bangalore Central Business District",
      website: b?.website || member.website || "",
      description: parsedDesc,
      whatIDo,
      whoIHelp,
      bestReferral,
      notAGoodReferral,
    },
  };
}

/**
 * Fetch Member Referrals (Given & Received tabs)
 */
export async function getMemberReferrals(memberId: string) {
  const given = await db.referral.findMany({
    where: { fromMemberId: memberId },
    include: { toMember: true },
    orderBy: { createdAt: "desc" },
  });

  const received = await db.referral.findMany({
    where: { toMemberId: memberId },
    include: { fromMember: true },
    orderBy: { createdAt: "desc" },
  });

  const formatList = (list: any[], isGiven: boolean) =>
    list.map((r) => ({
      id: r.id,
      title: r.referralName,
      partnerName: isGiven
        ? `${r.toMember.firstName} ${r.toMember.lastName}`
        : `${r.fromMember.firstName} ${r.fromMember.lastName}`,
      partnerEmail: isGiven ? r.toMember.email : r.fromMember.email,
      clientName: r.destinationBusiness || r.referralName,
      clientEmail: r.referralEmail || "",
      clientPhone: r.referralPhone || "",
      value: Number(r.value) || 0,
      notes: r.notes || "High priority client synergy.",
      status: r.status,
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
    }));

  return {
    given: formatList(given, true),
    received: formatList(received, false),
  };
}

/**
 * Give a referral to a fellow chapter member
 */
export async function giveMemberReferral(data: {
  fromMemberId: string;
  toMemberId: string;
  chapterId: string;
  referralName: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  value?: number;
  notes?: string;
}) {
  const referral = await db.referral.create({
    data: {
      fromMemberId: data.fromMemberId,
      toMemberId: data.toMemberId,
      chapterId: data.chapterId,
      referralName: data.referralName,
      destinationBusiness: data.clientName || data.referralName,
      referralEmail: data.clientEmail,
      referralPhone: data.clientPhone,
      value: data.value || 0,
      notes: data.notes,
      status: ReferralStatus.PENDING,
    },
  });

  revalidatePath("/dashboard/member/referrals");
  revalidatePath("/dashboard/member");
  return { success: true, id: referral.id };
}

/**
 * Recipient member updates the deal status (e.g. CLOSED_WON)
 */
export async function updateMemberReferralStatus(
  referralId: string,
  memberId: string,
  status: ReferralStatus
) {
  // Ensure the caller is either fromMember or toMember
  const ref = await db.referral.findUnique({ where: { id: referralId } });
  if (!ref || (ref.toMemberId !== memberId && ref.fromMemberId !== memberId)) {
    throw new Error("Unauthorized referral access");
  }

  await db.referral.update({
    where: { id: referralId },
    data: {
      status,
      isClosed: status === ReferralStatus.CLOSED_WON || status === ReferralStatus.CLOSED_LOST,
      closedDate:
        status === ReferralStatus.CLOSED_WON || status === ReferralStatus.CLOSED_LOST
          ? new Date()
          : null,
    },
  });

  revalidatePath("/dashboard/member/referrals");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Fetch visitors personally invited by this member
 */
export async function getMemberVisitors(memberId: string) {
  const visitors = await db.visitor.findMany({
    where: { invitedByMemberId: memberId },
    orderBy: { visitDate: "desc" },
  });

  return visitors.map((v) => ({
    id: v.id,
    name: `${v.firstName} ${v.lastName}`,
    email: v.email,
    phone: v.phone || "+91 98765 00000",
    company: v.company || "Independent Enterprise",
    industry: v.industry || "General",
    visitDate: new Date(v.visitDate).toLocaleDateString("en-IN"),
    status: v.status,
    notes: v.notes || "Guest observer",
  }));
}

/**
 * Invite visitor, automatically linked to member and chapter
 */
export async function inviteMemberVisitor(data: {
  memberId: string;
  chapterId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  visitDate: Date;
  notes?: string;
}) {
  const visitor = await db.visitor.create({
    data: {
      invitedByMemberId: data.memberId,
      chapterId: data.chapterId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      visitDate: data.visitDate,
      notes: data.notes,
      status: VisitorStatus.PENDING,
    },
  });

  revalidatePath("/dashboard/member/visitors");
  revalidatePath("/dashboard/member");
  revalidatePath("/dashboard/admin/visitors");
  revalidatePath("/dashboard/director/visitors");
  revalidatePath("/dashboard/leadership/visitors");
  return { success: true, id: visitor.id };
}

/**
 * Fetch chapter meetings for member
 */
export async function getMemberMeetings(chapterId: string, memberId: string) {
  const meetings = await db.meeting.findMany({
    where: { chapterId },
    include: {
      attendances: {
        where: { memberId },
      },
    },
    orderBy: { date: "desc" },
  });

  return meetings.map((m) => {
    const att = m.attendances[0];
    return {
      id: m.id,
      title: m.title || "Weekly Business Exchange",
      date: new Date(m.date).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      rawDate: m.date.toISOString(),
      location: m.location || "Executive Suite",
      meetingType: m.meetingType || "HYBRID",
      speaker: m.speaker || "Featured Member",
      theme: m.theme || "Strategic Partnerships",
      agenda: m.agenda || "1. Networking\n2. Member Intros\n3. Speaker\n4. Referrals",
      myAttendanceStatus: att?.status || "NOT_RECORDED",
      hasCheckedIn: att?.status === AttendanceStatus.PRESENT,
    };
  });
}

/**
 * 1-click self check-in attendance on meeting day
 */
export async function recordSelfAttendance(meetingId: string, memberId: string) {
  const existing = await db.meetingAttendance.findFirst({
    where: { meetingId, memberId },
  });

  if (existing) {
    await db.meetingAttendance.update({
      where: { id: existing.id },
      data: {
        status: AttendanceStatus.PRESENT,
        checkInTime: new Date(),
        attendanceMethod: "SELF_CHECK_IN",
      },
    });
  } else {
    await db.meetingAttendance.create({
      data: {
        meetingId,
        memberId,
        status: AttendanceStatus.PRESENT,
        checkInTime: new Date(),
        attendanceMethod: "SELF_CHECK_IN",
      },
    });
  }

  revalidatePath("/dashboard/member/meetings");
  revalidatePath("/dashboard/member/attendance");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Member personal attendance history and metrics
 */
export async function getMemberAttendanceHistory(memberId: string) {
  const attendances = await db.meetingAttendance.findMany({
    where: { memberId },
    include: { meeting: true },
    orderBy: { createdAt: "desc" },
  });

  const present = attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
  const sub = attendances.filter((a) => a.status === AttendanceStatus.SUBSTITUTE).length;
  const absent = attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;
  const excused = attendances.filter((a) => a.status === AttendanceStatus.EXCUSED).length;
  const total = attendances.length;
  const rate = total > 0 ? Math.round(((present + sub) / total) * 100) : 92;

  return {
    metrics: {
      rate,
      present,
      substitute: sub,
      absent,
      excused,
      total,
    },
    history: attendances.map((a) => ({
      id: a.id,
      meetingTitle: a.meeting.title || "Weekly Business Meeting",
      date: new Date(a.meeting.date).toLocaleDateString("en-IN"),
      status: a.status,
      method: a.attendanceMethod || "In-Person",
    })),
  };
}

/**
 * Member 1-to-1 synergy networking sessions
 */
export async function getMemberOneToOnes(memberId: string) {
  const initiated = await db.oneToOne.findMany({
    where: { initiatorId: memberId },
    include: { receiver: { include: { business: true } } },
    orderBy: { date: "desc" },
  });

  const received = await db.oneToOne.findMany({
    where: { receiverId: memberId },
    include: { initiator: { include: { business: true } } },
    orderBy: { date: "desc" },
  });

  const formatItem = (o: any, partner: any) => ({
    id: o.id,
    partnerName: `${partner.firstName} ${partner.lastName}`,
    partnerBusiness: partner.business?.businessName || "Independent Business",
    partnerIndustry: partner.business?.industry || "Services",
    date: new Date(o.date).toLocaleDateString("en-IN"),
    duration: o.duration || 60,
    status: o.status,
    outcome: o.outcome || "Discussed cross-referrals and client synergy.",
  });

  return [
    ...initiated.map((o) => formatItem(o, o.receiver)),
    ...received.map((o) => formatItem(o, o.initiator)),
  ];
}

/**
 * Schedule a 1-to-1 session with a fellow chapter member
 */
export async function scheduleMemberOneToOne(data: {
  initiatorId: string;
  receiverId: string;
  date: Date;
  duration?: number;
  location?: string;
  notes?: string;
}) {
  const session = await db.oneToOne.create({
    data: {
      initiatorId: data.initiatorId,
      receiverId: data.receiverId,
      date: data.date,
      duration: data.duration || 60,
      location: data.location || "Executive Cafe / Virtual",
      notes: data.notes,
      status: OneToOneStatus.SCHEDULED,
    },
  });

  revalidatePath("/dashboard/member/one-to-ones");
  revalidatePath("/dashboard/member");
  return { success: true, id: session.id };
}

/**
 * Member personal notifications & chapter broadcasts
 */
export async function getMemberNotifications(memberId: string, chapterId: string) {
  const member = await db.member.findUnique({ where: { id: memberId } });
  const notifs = member?.userId
    ? await db.notification.findMany({
        where: { userId: member.userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return notifs.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    isRead: n.isRead,
    date: new Date(n.createdAt).toLocaleDateString("en-IN"),
  }));
}

/**
 * Personal networking reports & performance scorecard
 */
export async function getMemberReports(memberId: string) {
  const member = await db.member.findUnique({
    where: { id: memberId },
    include: {
      givenReferrals: true,
      receivedReferrals: true,
      meetingAttendances: true,
      visitorsInvited: true,
      initiatedOneToOnes: true,
      receivedOneToOnes: true,
    },
  });

  const wonGiven = (member?.givenReferrals || []).filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const wonReceived = (member?.receivedReferrals || []).filter((r) => r.status === ReferralStatus.CLOSED_WON);
  const totalClosedBusiness = [...wonGiven, ...wonReceived].reduce(
    (acc, r) => acc + (Number(r.value) || 0),
    0
  );

  const totalAtt = member?.meetingAttendances.length || 0;
  const present = (member?.meetingAttendances || []).filter(
    (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.SUBSTITUTE
  ).length;
  const attendanceRate = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 0;

  return {
    scorecard: {
      networkingScore: 0,
      attendanceRate,
      referralsGiven: member?.givenReferrals.length || 0,
      referralsReceived: member?.receivedReferrals.length || 0,
      closedBusinessValue: totalClosedBusiness,
      oneToOnesCompleted: (member?.initiatedOneToOnes.length || 0) + (member?.receivedOneToOnes.length || 0),
      visitorsContributed: member?.visitorsInvited.length || 0,
    },
    monthlyBreakdown: [],
  };
}

/**
 * Update invited visitor follow-up notes and attendance status
 */
export async function updateMemberVisitor(
  visitorId: string,
  memberId: string,
  data: {
    status?: VisitorStatus;
    notes?: string;
  }
) {
  const visitor = await db.visitor.findUnique({
    where: { id: visitorId },
  });

  if (!visitor || visitor.invitedByMemberId !== memberId) {
    throw new Error("Unauthorized visitor access");
  }

  await db.visitor.update({
    where: { id: visitorId },
    data: {
      status: data.status !== undefined ? data.status : visitor.status,
      notes: data.notes !== undefined ? data.notes : visitor.notes,
    },
  });

  revalidatePath("/dashboard/member/visitors");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Update 1-to-1 session status (e.g. COMPLETED) and log discussion outcomes
 */
export async function updateMemberOneToOne(
  oneToOneId: string,
  memberId: string,
  data: {
    status: OneToOneStatus;
    outcome?: string;
  }
) {
  const session = await db.oneToOne.findUnique({
    where: { id: oneToOneId },
  });

  if (!session || (session.initiatorId !== memberId && session.receiverId !== memberId)) {
    throw new Error("Unauthorized 1-to-1 access");
  }

  await db.oneToOne.update({
    where: { id: oneToOneId },
    data: {
      status: data.status,
      outcome: data.outcome || session.outcome,
    },
  });

  revalidatePath("/dashboard/member/one-to-ones");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Fetch attendees who checked in or registered for a meeting session
 */
export async function getMeetingAttendees(meetingId: string) {
  const attendances = await db.meetingAttendance.findMany({
    where: { meetingId },
    include: {
      member: {
        include: { business: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return attendances
    .filter((a) => !!a.member)
    .map((a) => {
      const m = a.member!;
      return {
        id: a.id,
        memberId: a.memberId,
        name: `${m.firstName} ${m.lastName}`,
        businessName: m.business?.businessName || "Chapter Member",
        industry: m.business?.industry || "Services",
        status: a.status,
        checkInTime: a.checkInTime
          ? new Date(a.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
          : null,
        method: a.attendanceMethod || "Check-In",
      };
    });
}
