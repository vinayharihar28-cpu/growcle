"use server";

import { db } from "@/shared/lib/db";

export async function getChapterStats(chapterId: string = "temp-chapter-id") {
  try {
    const totalMembers = await db.member.count({
      where: { chapterId },
    });

    const totalReferrals = await db.referral.count({
      where: { chapterId },
    });

    const totalVisitors = await db.visitor.count({
      where: { chapterId },
    });

    const upcomingMeeting = await db.meeting.findFirst({
      where: { 
        chapterId,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' },
    });

    return {
      totalMembers,
      totalReferrals,
      totalVisitors,
      upcomingMeetingDate: upcomingMeeting?.date || null,
    };
  } catch (error) {
    console.error("Failed to fetch chapter stats:", error);
    return {
      totalMembers: 0,
      totalReferrals: 0,
      totalVisitors: 0,
      upcomingMeetingDate: null,
    };
  }
}
