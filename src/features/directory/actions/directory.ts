"use server";

import { db } from "@/shared/lib/db";

export async function getChapterMembers(chapterId: string) {
  try {
    return await db.member.findMany({
      where: { chapterId },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        businessName: true,
        industry: true,
        phoneNumber: true,
        bio: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching chapter members:", error);
    throw new Error("Failed to fetch chapter members");
  }
}
