"use server";

import { db } from "@/shared/lib/db";

export async function getMeetings(chapterId: string = "temp-chapter-id") {
  try {
    return await db.meeting.findMany({
      where: { chapterId },
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
        ...data,
        date: new Date(data.date),
      },
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw new Error("Failed to create meeting");
  }
}
