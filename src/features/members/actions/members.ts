"use server";

import { db } from "@/shared/lib/db";

export async function getMembers() {
  try {
    return await db.member.findMany({
      include: {
        organization: true,
        chapter: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}
