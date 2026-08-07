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

export async function createVisitor(data: {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
  industry?: string;
  chapterId: string;
  visitDate: Date | string;
}) {
  try {
    return await db.visitor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        businessName: data.businessName || null,
        industry: data.industry || null,
        chapterId: data.chapterId,
        visitDate: new Date(data.visitDate),
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Failed to create visitor:", error);
    throw new Error("Failed to register visitor");
  }
}

