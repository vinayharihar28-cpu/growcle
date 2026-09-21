"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getEffectiveChapterId(paramChapterId?: string): Promise<string | undefined> {
  if (paramChapterId && paramChapterId !== "all") return paramChapterId;
  if (paramChapterId === "all") return undefined;
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("active-chapter-id")?.value;
    if (cookieVal && cookieVal !== "all") return cookieVal;
  } catch (e) {
    // ignore
  }
  return undefined;
}

export async function getVisitors(chapterId?: string) {
  try {
    const effectiveChapterId = await getEffectiveChapterId(chapterId);
    const visitors = await db.visitor.findMany({
      where: effectiveChapterId ? { chapterId: effectiveChapterId } : undefined,
      include: {
        chapter: true,
        invitedBy: true,
      },
      orderBy: {
        visitDate: "desc",
      },
    });
    return visitors.map((v) => ({
      ...v,
      businessName: v.company || "Independent Enterprise",
      chapterName: v.chapter?.name || "All Chapters",
      invitedByName: v.invitedBy ? `${v.invitedBy.firstName} ${v.invitedBy.lastName}` : "Direct Lead",
    }));
  } catch (error) {
    console.error("Failed to fetch visitors:", error);
    return [];
  }
}

export async function createVisitor(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  chapterId: string;
  visitDate: Date | string;
  invitedByMemberId?: string;
  notes?: string;
}) {
  try {
    const newVisitor = await db.visitor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.businessName || null,
        industry: data.industry || null,
        chapterId: data.chapterId,
        visitDate: new Date(data.visitDate),
        invitedByMemberId: data.invitedByMemberId || null,
        notes: data.notes || null,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/visitors");
    revalidatePath("/dashboard/admin/visitors");
    revalidatePath("/dashboard/director/visitors");
    revalidatePath("/dashboard/leadership/visitors");
    revalidatePath("/dashboard/member/visitors");

    return newVisitor;
  } catch (error) {
    console.error("Failed to create visitor:", error);
    throw new Error("Failed to register visitor");
  }
}
