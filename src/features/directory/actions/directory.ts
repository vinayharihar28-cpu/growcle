"use server";

import { db } from "@/shared/lib/db";

export async function getChapterMembers(chapterId: string) {
  try {
    const members = await db.member.findMany({
      where: { chapterId },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        business: {
          select: { 
            businessName: true,
            industry: true
          }
        },
        phoneNumber: true,
        bio: true,
        email: true,
        createdAt: true,
      },
    });

    return members.map(m => ({
      ...m,
      businessName: m.business?.businessName || null,
      industry: m.business?.industry || null,
    }));
  } catch (error) {
    console.error("Error fetching chapter members:", error);
    throw new Error("Failed to fetch chapter members");
  }
}
