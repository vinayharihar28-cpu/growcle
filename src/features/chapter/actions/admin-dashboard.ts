"use server";

import { db } from "@/shared/lib/db";

// ────────────────────────────────────────────────────────────────────────────
// Admin Dashboard: Chapter health KPIs
// ────────────────────────────────────────────────────────────────────────────
export async function getChapterAdminStats(chapterId: string) {
  try {
    const totalMembers = await db.member.count({ where: { chapterId, isActive: true } });

    const totalReferrals = await db.referral.count({ where: { chapterId } });

    const closedBusiness = await db.referral.aggregate({
      where: { chapterId, status: "CLOSED_WON" },
      _sum: { value: true },
    });

    const totalVisitors = await db.visitor.count({ where: { chapterId } });

    const convertedVisitors = await db.visitor.count({
      where: { chapterId, status: "CONVERTED" },
    });

    const visitorConversionRate =
      totalVisitors > 0
        ? Math.round((convertedVisitors / totalVisitors) * 100)
        : 0;

    const upcomingMeeting = await db.meeting.findFirst({
      where: { chapterId, date: { gte: new Date() }, status: "SCHEDULED" },
      orderBy: { date: "asc" },
    });

    const lastMeeting = await db.meeting.findFirst({
      where: { chapterId, date: { lt: new Date() } },
      orderBy: { date: "desc" },
    });

    // Compute 8-week attendance trend
    const weeklyAttendance: { week: string; rate: number; present: number; total: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const meetingsThisWeek = await db.meeting.findMany({
        where: { chapterId, date: { gte: weekStart, lte: weekEnd } },
        select: { id: true, date: true },
      });

      if (meetingsThisWeek.length > 0) {
        const meetingIds = meetingsThisWeek.map((m) => m.id);
        const totalAttendees = await db.meetingAttendance.count({
          where: { meetingId: { in: meetingIds }, memberId: { not: null } },
        });
        const presentAttendees = await db.meetingAttendance.count({
          where: {
            meetingId: { in: meetingIds },
            memberId: { not: null },
            status: { in: ["PRESENT", "SUBSTITUTE"] },
          },
        });
        const rate = totalAttendees > 0 ? Math.round((presentAttendees / totalAttendees) * 100) : 0;
        weeklyAttendance.push({
          week: `W${8 - i}`,
          rate,
          present: presentAttendees,
          total: totalAttendees,
        });
      } else {
        weeklyAttendance.push({ week: `W${8 - i}`, rate: 0, present: 0, total: 0 });
      }
    }

    // Overall attendance rate from last meeting
    const lastMeetingAttendance = lastMeeting
      ? await db.meetingAttendance.findMany({
          where: { meetingId: lastMeeting.id, memberId: { not: null } },
        })
      : [];
    const lastMeetingPresent = lastMeetingAttendance.filter((a) =>
      ["PRESENT", "SUBSTITUTE"].includes(a.status)
    ).length;
    const lastMeetingRate =
      lastMeetingAttendance.length > 0
        ? Math.round((lastMeetingPresent / lastMeetingAttendance.length) * 100)
        : 0;

    return {
      totalMembers,
      totalReferrals,
      chapterRevenue: Number(closedBusiness._sum.value || 0),
      visitorConversionRate,
      totalVisitors,
      upcomingMeeting,
      lastMeetingRate,
      weeklyAttendance,
    };
  } catch (error) {
    console.error("Failed to fetch chapter admin stats:", error);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Attendance Sheet: members for a specific meeting
// ────────────────────────────────────────────────────────────────────────────
export async function getMeetingAttendanceSheet(meetingId: string) {
  try {
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        chapter: { select: { name: true, id: true } },
      },
    });

    if (!meeting) return null;

    // Get all active members in this chapter
    const members = await db.member.findMany({
      where: { chapterId: meeting.chapterId, isActive: true },
      include: {
        business: { select: { businessName: true, businessCategory: true } },
        meetingAttendances: {
          where: { meetingId },
          select: { id: true, status: true, notes: true },
        },
      },
      orderBy: { firstName: "asc" },
    });

    return { meeting, members };
  } catch (error) {
    console.error("Failed to fetch attendance sheet:", error);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Get all meetings for a chapter (for attendance selection)
// ────────────────────────────────────────────────────────────────────────────
export async function getChapterMeetings(chapterId: string) {
  try {
    return await db.meeting.findMany({
      where: { chapterId },
      orderBy: { date: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Failed to fetch chapter meetings:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Upsert attendance record for a member at a meeting
// ────────────────────────────────────────────────────────────────────────────
export async function upsertMemberAttendance(
  meetingId: string,
  memberId: string,
  status: "PRESENT" | "ABSENT" | "SUBSTITUTE" | "EXCUSED",
  notes?: string
) {
  try {
    const existing = await db.meetingAttendance.findFirst({
      where: { meetingId, memberId },
    });

    if (existing) {
      return await db.meetingAttendance.update({
        where: { id: existing.id },
        data: { status, notes },
      });
    } else {
      return await db.meetingAttendance.create({
        data: { meetingId, memberId, status, notes },
      });
    }
  } catch (error) {
    console.error("Failed to upsert attendance:", error);
    throw error;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Create new meeting
// ────────────────────────────────────────────────────────────────────────────
export async function createChapterMeeting(data: {
  chapterId: string;
  title: string;
  date: string;
  startTime?: string;
  location?: string;
  speaker?: string;
  theme?: string;
  agenda?: string;
  meetingType?: string;
  zoomLink?: string;
  isHybrid?: boolean;
}) {
  try {
    return await db.meeting.create({
      data: {
        ...data,
        date: new Date(data.date),
        startTime: data.startTime ? new Date(data.startTime) : null,
      },
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw error;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Get meeting agenda (for printable agenda view)
// ────────────────────────────────────────────────────────────────────────────
export async function getMeetingAgenda(meetingId: string) {
  try {
    return await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        chapter: { select: { name: true } },
        attendances: {
          where: { memberId: { not: null } },
          include: {
            member: {
              select: {
                firstName: true,
                lastName: true,
                business: { select: { businessName: true, businessCategory: true } },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch meeting agenda:", error);
    return null;
  }
}
