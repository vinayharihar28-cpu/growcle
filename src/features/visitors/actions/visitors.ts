"use server";

import { db } from "@/shared/lib/db";

export async function getVisitors() {
  try {
    return await db.visitor.findMany({
      include: {
        chapter: true,
      },
      orderBy: {
        visitDate: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch visitors:", error);
    return [];
  }
}
