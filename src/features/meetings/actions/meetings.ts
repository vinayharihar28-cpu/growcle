"use server";

import { db } from "@/shared/lib/db";

export async function getMeetings(chapterId?: string) {
  try {
    const whereClause = chapterId && chapterId !== "all" && chapterId !== "temp-chapter-id"
      ? { chapterId }
      : {};
    return await db.meeting.findMany({
      where: whereClause,
      include: {
        chapter: {
          select: { id: true, name: true, chapterCode: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    return [];
  }
}

export async function createMeeting(data: any) {
  try {
    return await db.meeting.create({
      data: {
        chapterId: data.chapterId,
        theme: data.theme || "Weekly Business Meeting",
        title: data.title || data.theme || "Weekly Business Meeting",
        date: new Date(data.date),
        startTime: data.startTime || "07:30 AM",
        location: data.venue || data.location || "Hybrid Meeting Room",
        agenda: data.agenda || "1. Networking 2. Presentations 3. Referral Exchange",
        status: data.status || "SCHEDULED",
        meetingType: data.meetingType || "IN_PERSON",
      },
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw new Error("Failed to create meeting");
  }
}

export async function updateMeeting(meetingId: string, data: {
  date?: string | Date;
  startTime?: string;
  venue?: string;
  theme?: string;
  agenda?: string;
  status?: any;
}) {
  try {
    const updateData: any = {};
    if (data.date) updateData.date = new Date(data.date);
    if (data.startTime) updateData.startTime = data.startTime;
    if (data.venue) {
      updateData.venue = data.venue;
      updateData.location = data.venue;
    }
    if (data.theme) {
      updateData.theme = data.theme;
      updateData.title = data.theme;
    }
    if (data.agenda) updateData.agenda = data.agenda;
    if (data.status) updateData.status = data.status;

    return await db.meeting.update({
      where: { id: meetingId },
      data: updateData,
    });
  } catch (error) {
    console.error("Failed to update meeting:", error);
    throw new Error("Failed to update meeting");
  }
}

export async function getChaptersForMeetings() {
  try {
    return await db.chapter.findMany({
      select: {
        id: true,
        name: true,
        chapterCode: true,
        meetingDay: true,
        meetingTime: true,
        meetingLocation: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return [];
  }
}
