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
