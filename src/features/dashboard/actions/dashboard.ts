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
            businessName: true
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
      take: 3,
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

    return {
      referralsGiven,
      referralsReceived,
      referralsValue: closedBusinessValue._sum.value || 0,
      oneToOnesCount,
      attendanceRate,
      recentReferrals,
      upcomingMeetings
    };
  } catch (error) {
    console.error("Failed to fetch member dashboard stats:", error);
    return null;
  }
}
