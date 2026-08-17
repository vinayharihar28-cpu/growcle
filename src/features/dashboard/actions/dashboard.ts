"use server";

import { db } from "@/shared/lib/db";

export async function getMemberDashboardStats(memberId: string) {
  try {
    const referralsGiven = await db.referral.count({
      where: { fromMemberId: memberId }
    });

    const referralsReceived = await db.referral.count({
      where: { toMemberId: memberId }
    });

    const closedBusinessValue = await db.referral.aggregate({
      where: {
        toMemberId: memberId,
        status: "CLOSED_WON"
      },
      _sum: {
        value: true
      }
    });

    const oneToOnesCount = await db.oneToOne.count({
      where: {
        OR: [
          { initiatorId: memberId },
          { receiverId: memberId }
        ]
      }
    });

    const recentReferrals = await db.referral.findMany({
      where: { fromMemberId: memberId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        toMember: {
          select: {
            firstName: true,
            lastName: true,
            business: {
              select: { businessName: true }
            }
          }
        }
      }
    });

    // Fetch member chapter
    const member = await db.member.findUnique({
      where: { id: memberId },
      select: { chapterId: true }
    });

    const upcomingMeetings = member?.chapterId ? await db.meeting.findMany({
      where: {
        chapterId: member.chapterId,
        date: { gte: new Date() }
      },
      orderBy: { date: "asc" },
      take: 5,
      include: {
        chapter: {
          select: {
            name: true
          }
        }
      }
    }) : [];

    // Compute attendance rate
    const totalAttendances = await db.meetingAttendance.count({
      where: { memberId }
    });

    const presentAttendances = await db.meetingAttendance.count({
      where: {
        memberId,
        status: { in: ["PRESENT", "SUBSTITUTE"] }
      }
    });

    const attendanceRate = totalAttendances > 0 
      ? Math.round((presentAttendances / totalAttendances) * 100) 
      : 100;

    const mappedRecentReferrals = recentReferrals.map(r => ({
      ...r,
      toMember: {
        ...r.toMember,
        businessName: r.toMember.business?.businessName || null
      }
    }));

    // Generate 6-Month Revenue Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const monthlyRevenue: { month: string; revenue: number; referrals: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const agg = await db.referral.aggregate({
        where: {
          toMemberId: memberId,
          status: "CLOSED_WON",
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { value: true },
        _count: { id: true }
      });

      monthlyRevenue.push({
        month: monthNames[d.getMonth()],
        revenue: Number(agg._sum.value || 0),
        referrals: agg._count.id || 0
      });
    }

    return {
      referralsGiven,
      referralsReceived,
      referralsValue: Number(closedBusinessValue._sum.value || 0),
      oneToOnesCount,
      attendanceRate,
      recentReferrals: mappedRecentReferrals,
      upcomingMeetings,
      monthlyRevenue
    };
  } catch (error) {
    console.error("Failed to fetch member dashboard stats:", error);
    return null;
  }
}

export async function getOrganizationDashboardStats(organizationId: string) {
  try {
    const [organization, chapterCount, memberCount, referralValue, chapters] = await Promise.all([
      db.organization.findUnique({
        where: { id: organizationId },
        select: { name: true },
      }),
      db.chapter.count({ where: { organizationId, isActive: true } }),
      db.member.count({ where: { organizationId, isActive: true } }),
      db.referral.aggregate({
        where: {
          chapter: { organizationId },
          status: "CLOSED_WON",
        },
        _sum: { value: true },
      }),
      db.chapter.findMany({
        where: { organizationId, isActive: true },
        select: {
          id: true,
          name: true,
          region: true,
          _count: { select: { members: { where: { isActive: true } } } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const totalVisitors = await db.visitor.groupBy({
      by: ['chapterId'],
      where: { chapterId: { in: chapters.map(c => c.id) } },
      _count: { id: true },
    });

    const convertedVisitors = await db.visitor.groupBy({
      by: ['chapterId'],
      where: { chapterId: { in: chapters.map(c => c.id) }, status: "CONVERTED" },
      _count: { id: true },
    });

    const visitorCountMap = Object.fromEntries(totalVisitors.map(v => [v.chapterId, v._count.id]));
    const convertedCountMap = Object.fromEntries(convertedVisitors.map(v => [v.chapterId, v._count.id]));

    const chapterMetrics = chapters.map((chapter) => {
      const visitors = visitorCountMap[chapter.id] || 0;
      const converted = convertedCountMap[chapter.id] || 0;

      return {
        ...chapter,
        activeMembers: chapter._count.members,
        visitorConversionRate: visitors ? Math.round((converted / visitors) * 100) : 0,
      };
    });

    const topChapter = [...chapterMetrics].sort((a, b) => b.activeMembers - a.activeMembers)[0] ?? null;

    return {
      organizationName: organization?.name ?? "Organization",
      totalChapters: chapterCount,
      totalMembers: memberCount,
      revenueGenerated: Number(referralValue._sum.value ?? 0),
      topChapter,
      chapters: chapterMetrics,
    };
  } catch (error) {
    console.error("Failed to fetch organization dashboard stats:", error);
    return null;
  }
}

export async function getPlatformDashboardStats() {
  try {
    const [activeOrganizations, subscriptions, recentAuditLogs] = await Promise.all([
      db.organization.count({ where: { isActive: true, deletedAt: null } }),
      db.subscription.findMany({
        where: { status: "ACTIVE" },
        select: { price: true, currency: true },
      }),
      db.auditLog.findMany({
        orderBy: { when: "desc" },
        take: 6,
        select: { id: true, action: true, entity: true, when: true, who: true },
      }),
    ]);

    const mrr = subscriptions.reduce((total, subscription) => total + Number(subscription.price), 0);

    return {
      activeOrganizations,
      activeSubscriptions: subscriptions.length,
      mrr,
      currency: subscriptions[0]?.currency ?? "USD",
      recentAuditLogs,
    };
  } catch (error) {
    console.error("Failed to fetch platform dashboard stats:", error);
    return null;
  }
}
