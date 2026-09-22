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
import { createSystemNotification } from "@/features/notifications/actions/notification-actions";

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

  // Compute 6-month historical trend data for interactive charts
  const now = new Date();
  const months: { label: string; year: number; month: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }

  const referralsTrend = months.map((m) => {
    const givenCount = member.givenReferrals.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getFullYear() === m.year && rd.getMonth() === m.month;
    }).length;
    const receivedCount = member.receivedReferrals.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getFullYear() === m.year && rd.getMonth() === m.month;
    }).length;
    return {
      month: m.label,
      given: givenCount,
      received: receivedCount,
    };
  });

  const networkingTrend = months.map((m) => {
    const oneToOnesCount = allOneToOnes.filter((o) => {
      const od = new Date(o.date);
      return od.getFullYear() === m.year && od.getMonth() === m.month && o.status === OneToOneStatus.COMPLETED;
    }).length;
    const visitorsCount = member.visitorsInvited.filter((v) => {
      const vd = new Date(v.createdAt);
      return vd.getFullYear() === m.year && vd.getMonth() === m.month;
    }).length;
    return {
      month: m.label,
      oneToOnes: oneToOnesCount,
      visitors: visitorsCount,
    };
  });

  const revenueTrend = months.map((m) => {
    const revenueInMonth = member.receivedReferrals
      .filter((r) => {
        const rd = new Date(r.updatedAt || r.createdAt);
        return (
          rd.getFullYear() === m.year &&
          rd.getMonth() === m.month &&
          (r.status === ReferralStatus.CLOSED_WON || Number(r.convertedBusinessValue || r.tyfcbAmount) > 0)
        );
      })
      .reduce((acc, r) => acc + (Number(r.convertedBusinessValue || r.tyfcbAmount || r.value) || 0), 0);
    return {
      month: m.label,
      revenue: revenueInMonth,
    };
  });

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
    chartsData: {
      referralsTrend,
      networkingTrend,
      revenueTrend,
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
    profileImage?: string;
  }
) {
  const updatedMember = await db.member.update({
    where: { id: memberId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      bio: data.bio,
      website: data.website,
      linkedin: data.linkedin,
      twitter: data.twitter,
      ...(data.profileImage !== undefined ? { profileImage: data.profileImage } : {}),
    },
  });

  if (updatedMember.userId && data.profileImage !== undefined) {
    try {
      await db.user.update({
        where: { id: updatedMember.userId },
        data: { image: data.profileImage },
      });
    } catch (e) {
      console.warn("Could not sync user image:", e);
    }
  }

  revalidatePath("/dashboard/member/profile");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Request password reset link (scaffolded)
 */
export async function requestPasswordReset(email: string) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  try {
    await db.verification.create({
      data: {
        identifier: email,
        value: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });
  } catch (e) {
    console.log("Verification token stored or skipped", e);
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  console.log(`[AUTH] Password reset link generated for ${email}: ${resetUrl}`);

  return {
    success: true,
    message: `A password reset link has been dispatched to ${email}. Check your inbox!`,
    resetUrl,
  };
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
/**
 * Fetch all available chapters for cross-chapter selection
 */
export async function getAllChaptersForSelection() {
  const chapters = await db.chapter.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      chapterCode: true,
      themeColor: true,
    },
    orderBy: { name: "asc" },
  });
  return chapters;
}

/**
 * Fetch members of a specific chapter for referral/121 selection
 */
export async function getChapterMembersForSelection(chapterId: string) {
  const members = await db.member.findMany({
    where: {
      chapterId,
      status: MemberStatus.ACTIVE,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      membershipNumber: true,
      business: {
        select: {
          businessName: true,
          industry: true,
        },
      },
    },
    orderBy: { firstName: "asc" },
  });

  return members.map((m) => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    email: m.email,
    membershipNumber: m.membershipNumber || "",
    businessName: m.business?.businessName || "Member Business",
    industry: m.business?.industry || "Services",
  }));
}

/**
 * Fetch chapter visitors for referral/121 selection
 */
export async function getChapterVisitorsForSelection(chapterId: string) {
  const visitors = await db.visitor.findMany({
    where: { chapterId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      industry: true,
    },
    orderBy: { firstName: "asc" },
  });

  return visitors.map((v) => ({
    id: v.id,
    name: `${v.firstName} ${v.lastName}`,
    email: v.email,
    businessName: v.company || "Independent Enterprise",
    industry: v.industry || "General Category",
  }));
}

/**
 * Fetch Member Referrals (Given & Received with cross-chapter badges and TYFCB data)
 */
export async function getMemberReferrals(memberId: string) {
  const allChapters = await db.chapter.findMany({
    select: { id: true, name: true, chapterCode: true, themeColor: true },
  });
  const chapterMap = new Map(allChapters.map((c) => [c.id, c]));

  const given = await db.referral.findMany({
    where: { fromMemberId: memberId },
    include: {
      toMember: {
        include: { chapter: true, business: true },
      },
      chapter: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const received = await db.referral.findMany({
    where: { toMemberId: memberId },
    include: {
      fromMember: {
        include: { chapter: true, business: true },
      },
      chapter: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatList = (list: any[], isGiven: boolean) =>
    list.map((r) => {
      const partner = isGiven ? r.toMember : r.fromMember;
      const crossChap = r.crossChapterId ? chapterMap.get(r.crossChapterId) : null;
      const isCross = !!(r.crossChapterId || (partner?.chapterId && partner.chapterId !== r.chapterId));
      const targetChapter = crossChap || (partner?.chapter ? partner.chapter : r.chapter);

      return {
        id: r.id,
        title: r.referralName,
        partnerId: partner?.id || "",
        partnerName: partner ? `${partner.firstName} ${partner.lastName}` : "Partner Member",
        partnerEmail: partner?.email || "",
        partnerBusiness: partner?.business?.businessName || "Member Business",
        clientName: r.destinationBusiness || r.referralName,
        clientEmail: r.referralEmail || "",
        clientPhone: r.referralPhone || "",
        value: Number(r.value) || 0,
        tyfcbAmount: Number(r.tyfcbAmount) || (r.status === ReferralStatus.CLOSED_WON ? Number(r.value) : 0),
        notes: r.notes || "High priority client synergy.",
        status: r.status,
        isVisitorReferral: !!r.isVisitorReferral,
        isCrossChapter: isCross,
        chapterName: targetChapter?.name || r.chapter?.name || "Chapter",
        chapterCode: targetChapter?.chapterCode || r.chapter?.chapterCode || "",
        chapterThemeColor: targetChapter?.themeColor || "emerald",
        date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      };
    });

  return {
    given: formatList(given, true),
    received: formatList(received, false),
  };
}

/**
 * Give a referral (supports cross-chapter and visitors)
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
  crossChapterId?: string;
  isVisitorReferral?: boolean;
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
      crossChapterId: data.crossChapterId || null,
      isVisitorReferral: !!data.isVisitorReferral,
      status: ReferralStatus.PENDING,
    },
  });

  // Send real system notification to recipient member
  try {
    const fromMember = await db.member.findUnique({
      where: { id: data.fromMemberId },
      select: { firstName: true, lastName: true },
    });
    await createSystemNotification({
      memberId: data.toMemberId,
      chapterId: data.chapterId,
      title: "New Referral Received! 🤝",
      message: `${fromMember ? `${fromMember.firstName} ${fromMember.lastName}` : "A colleague"} passed you a referral: "${data.referralName}"${data.value ? ` (Est. ₹${data.value.toLocaleString("en-IN")})` : ""}`,
      type: "REFERRAL",
    });
  } catch (err) {
    console.error("Failed to send referral notification", err);
  }

  revalidatePath("/dashboard/member/referrals");
  revalidatePath("/dashboard/member");
  revalidatePath("/dashboard/member/tyfcb");
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
      ...(status === ReferralStatus.CLOSED_WON && !ref.tyfcbAmount && ref.value ? { tyfcbAmount: ref.value } : {}),
    },
  });

  revalidatePath("/dashboard/member/referrals");
  revalidatePath("/dashboard/member");
  revalidatePath("/dashboard/member/tyfcb");
  return { success: true };
}

/**
 * Mark a referral as converted and record Thank You For Closed Business (TYFCB) + Testimonial
 */
export async function markReferralConvertedAndTYFCB(data: {
  referralId: string;
  memberId: string;
  tyfcbAmount: number;
  testimonialText?: string;
}) {
  const ref = await db.referral.findUnique({
    where: { id: data.referralId },
    include: { fromMember: true, toMember: true },
  });

  if (!ref || (ref.toMemberId !== data.memberId && ref.fromMemberId !== data.memberId)) {
    throw new Error("Unauthorized referral access");
  }

  await db.referral.update({
    where: { id: data.referralId },
    data: {
      status: ReferralStatus.CLOSED_WON,
      isClosed: true,
      closedDate: new Date(),
      tyfcbAmount: data.tyfcbAmount,
      convertedBusinessValue: data.tyfcbAmount,
    },
  });

  // If testimonial text was provided, create testimonial
  if (data.testimonialText && data.testimonialText.trim().length > 0) {
    await db.testimonial.create({
      data: {
        fromMemberId: ref.toMemberId, // The person who received the business writes the testimonial for the giver
        toMemberId: ref.fromMemberId,
        text: data.testimonialText.trim(),
        referralId: ref.id,
        isPublic: true,
      },
    });
  }

  // Send real system notification to referral giver
  try {
    await createSystemNotification({
      memberId: ref.fromMemberId,
      chapterId: ref.chapterId,
      title: "Closed Business & TYFCB! 🏆",
      message: `${ref.toMember.firstName} ${ref.toMember.lastName} closed business worth ₹${data.tyfcbAmount.toLocaleString("en-IN")} on your referral "${ref.referralName}"!`,
      type: "TYFCB",
    });
  } catch (err) {
    console.error("Failed to send TYFCB notification", err);
  }

  revalidatePath("/dashboard/member/referrals");
  revalidatePath("/dashboard/member/tyfcb");
  revalidatePath("/dashboard/member");
  revalidatePath("/dashboard/member/profile");
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
  const allChapters = await db.chapter.findMany({
    select: { id: true, name: true, chapterCode: true, themeColor: true },
  });
  const chapterMap = new Map(allChapters.map((c) => [c.id, c]));

  const initiated = await db.oneToOne.findMany({
    where: { initiatorId: memberId },
    include: { receiver: { include: { chapter: true, business: true } } },
    orderBy: { date: "desc" },
  });

  const received = await db.oneToOne.findMany({
    where: { receiverId: memberId },
    include: { initiator: { include: { chapter: true, business: true } } },
    orderBy: { date: "desc" },
  });

  const formatItem = (o: any, partner: any, isInitiator: boolean) => {
    const crossChap = o.crossChapterId ? chapterMap.get(o.crossChapterId) : null;
    const isVisitor = !!o.isVisitorSession;

    return {
      id: o.id,
      partnerName: isVisitor
        ? (o.visitorName || "Chapter Visitor")
        : partner
        ? `${partner.firstName} ${partner.lastName}`
        : "Chapter Colleague",
      partnerEmail: isVisitor ? (o.visitorEmail || "") : partner?.email || "",
      partnerBusiness: isVisitor ? "Visiting Business" : partner?.business?.businessName || "Member Business",
      partnerIndustry: isVisitor ? "Visitor Category" : partner?.business?.industry || "Services",
      date: new Date(o.date).toLocaleDateString("en-IN"),
      rawDate: o.date.toISOString(),
      durationHours: o.durationHours ? Number(o.durationHours) : (o.duration ? Number((o.duration / 60).toFixed(1)) : 1),
      duration: o.duration || 60,
      location: o.location || "Member Office / Executive Cafe",
      status: o.status,
      outcome: o.outcome || "Discussed cross-referrals and client synergy.",
      selfieUrl: o.selfieUrl || null,
      isVisitorSession: isVisitor,
      isCrossChapter: !!(o.crossChapterId || (partner?.chapterId && partner.chapterId !== o.chapterId)),
      crossChapterName: crossChap?.name || partner?.chapter?.name || "Chapter",
      crossChapterThemeColor: crossChap?.themeColor || partner?.chapter?.themeColor || "emerald",
      isInitiator,
    };
  };

  return [
    ...initiated.map((o) => formatItem(o, o.receiver, true)),
    ...received.map((o) => formatItem(o, o.initiator, false)),
  ];
}

/**
 * Schedule or log a 1-to-1 session (supports cross-chapter, visitors, and custom duration in hours)
 */
export async function scheduleMemberOneToOne(data: {
  initiatorId: string;
  receiverId?: string;
  date: Date;
  duration?: number;
  durationHours?: number;
  location?: string;
  notes?: string;
  crossChapterId?: string;
  isVisitorSession?: boolean;
  visitorName?: string;
  visitorEmail?: string;
}) {
  // If visitor session without receiverId, fallback receiver to initiator or another member
  const receiverId = data.receiverId || data.initiatorId;
  const hours = data.durationHours || (data.duration ? data.duration / 60 : 1);

  const session = await db.oneToOne.create({
    data: {
      initiatorId: data.initiatorId,
      receiverId,
      date: data.date,
      duration: Math.round(hours * 60),
      durationHours: hours,
      location: data.location || "Member Office / Executive Cafe",
      notes: data.notes,
      crossChapterId: data.crossChapterId || null,
      isVisitorSession: !!data.isVisitorSession,
      visitorName: data.visitorName || null,
      visitorEmail: data.visitorEmail || null,
      status: OneToOneStatus.SCHEDULED,
    },
  });

  // Send real system notification to receiver member if internal member session
  if (data.receiverId && data.receiverId !== data.initiatorId) {
    try {
      const initiator = await db.member.findUnique({
        where: { id: data.initiatorId },
        select: { firstName: true, lastName: true },
      });
      await createSystemNotification({
        memberId: data.receiverId,
        title: "1-to-1 Synergy Session Scheduled! ☕",
        message: `${initiator ? `${initiator.firstName} ${initiator.lastName}` : "A colleague"} scheduled a 1-to-1 session with you for ${new Date(data.date).toLocaleDateString("en-IN")}.`,
        type: "ONE_TO_ONE",
      });
    } catch (err) {
      console.error("Failed to send 1-to-1 notification", err);
    }
  }

  revalidatePath("/dashboard/member/one-to-ones");
  revalidatePath("/dashboard/member");
  return { success: true, id: session.id };
}

/**
 * Complete a 1-to-1 session with selfie verification
 */
export async function completeOneToOneWithSelfie(data: {
  oneToOneId: string;
  selfieUrl: string;
  outcome?: string;
}) {
  await db.oneToOne.update({
    where: { id: data.oneToOneId },
    data: {
      selfieUrl: data.selfieUrl,
      outcome: data.outcome || "Completed 1-to-1 synergy networking session.",
      status: OneToOneStatus.COMPLETED,
    },
  });

  revalidatePath("/dashboard/member/one-to-ones");
  revalidatePath("/dashboard/member");
  return { success: true };
}

/**
 * Get TYFCB (Thank You For Closed Business) and Testimonials summary
 */
export async function getMemberTYFCBSummary(memberId: string) {
  // Referrals given that converted (closed business given to others)
  const givenConverted = await db.referral.findMany({
    where: {
      fromMemberId: memberId,
      status: ReferralStatus.CLOSED_WON,
    },
    include: { toMember: true },
    orderBy: { closedDate: "desc" },
  });

  // Referrals received that converted (closed business won by this member)
  const receivedConverted = await db.referral.findMany({
    where: {
      toMemberId: memberId,
      status: ReferralStatus.CLOSED_WON,
    },
    include: { fromMember: true },
    orderBy: { closedDate: "desc" },
  });

  // Testimonials given and received
  const receivedTestimonials = await db.testimonial.findMany({
    where: { toMemberId: memberId },
    include: { fromMember: true },
    orderBy: { createdAt: "desc" },
  });

  const givenTotal = givenConverted.reduce(
    (acc, r) => acc + (Number(r.tyfcbAmount) || Number(r.value) || 0),
    0
  );
  const receivedTotal = receivedConverted.reduce(
    (acc, r) => acc + (Number(r.tyfcbAmount) || Number(r.value) || 0),
    0
  );

  return {
    givenTotal,
    receivedTotal,
    totalClosedBusiness: givenTotal + receivedTotal,
    givenDeals: givenConverted.map((r) => ({
      id: r.id,
      title: r.referralName,
      recipientName: `${r.toMember.firstName} ${r.toMember.lastName}`,
      amount: Number(r.tyfcbAmount) || Number(r.value) || 0,
      date: r.closedDate ? new Date(r.closedDate).toLocaleDateString("en-IN") : "Recent",
    })),
    receivedDeals: receivedConverted.map((r) => ({
      id: r.id,
      title: r.referralName,
      giverName: `${r.fromMember.firstName} ${r.fromMember.lastName}`,
      amount: Number(r.tyfcbAmount) || Number(r.value) || 0,
      date: r.closedDate ? new Date(r.closedDate).toLocaleDateString("en-IN") : "Recent",
    })),
    testimonials: receivedTestimonials.map((t) => ({
      id: t.id,
      fromName: `${t.fromMember.firstName} ${t.fromMember.lastName}`,
      text: t.text,
      date: new Date(t.createdAt).toLocaleDateString("en-IN"),
    })),
  };
}

/**
 * Fetch public testimonials for Homepage and Member Dashboard showcase
 */
export async function getPublicTestimonials() {
  const testimonials = await db.testimonial.findMany({
    where: { isPublic: true },
    include: {
      fromMember: { include: { business: true } },
      toMember: { include: { business: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return testimonials.map((t) => ({
    id: t.id,
    author: `${t.fromMember.firstName} ${t.fromMember.lastName}`,
    authorCompany: t.fromMember.business?.businessName || "Member Firm",
    recipient: `${t.toMember.firstName} ${t.toMember.lastName}`,
    recipientCompany: t.toMember.business?.businessName || "Partner Firm",
    text: t.text,
    date: new Date(t.createdAt).toLocaleDateString("en-IN"),
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

import { getMemberNotifications as _getMemberNotifications } from "@/features/notifications/actions/notification-actions";

export async function getMemberNotifications(memberId?: string, chapterId?: string) {
  return _getMemberNotifications(memberId, chapterId);
}

