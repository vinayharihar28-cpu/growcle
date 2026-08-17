"use server";

import { db } from "@/shared/lib/db";
import { ReferralStatus } from "@prisma/client";

export async function getReferrals(memberId?: string) {
  try {
    const whereCondition = memberId
      ? {
          OR: [
            { fromMemberId: memberId },
            { toMemberId: memberId },
          ],
        }
      : {};

    return await db.referral.findMany({
      where: whereCondition,
      include: {
        fromMember: true,
        toMember: true,
        chapter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch referrals:", error);
    return [];
  }
}

export async function createReferral(data: {
  fromMemberId: string;
  toMemberId: string;
  chapterId: string;
  referralName: string;
  referralEmail?: string;
  referralPhone?: string;
  notes?: string;
  value?: string | number;
  category?: string;
  priority?: string;
}) {
  try {
    const referral = await db.referral.create({
      data: {
        fromMemberId: data.fromMemberId,
        toMemberId: data.toMemberId,
        chapterId: data.chapterId,
        referralName: data.referralName,
        referralEmail: data.referralEmail || null,
        referralPhone: data.referralPhone || null,
        notes: data.notes || null,
        category: data.category || null,
        priority: data.priority || "MEDIUM",
        value: data.value ? parseFloat(data.value.toString()) : null,
        status: "PENDING",
      },
    });
    return { success: true, data: referral };
  } catch (error) {
    console.error("Failed to create referral:", error);
    return { success: false, error: "Failed to create referral" };
  }
}

export async function updateReferralStatus(
  referralId: string,
  status: ReferralStatus,
  value?: number
) {
  try {
    const updated = await db.referral.update({
      where: { id: referralId },
      data: {
        status,
        ...(value !== undefined ? { value } : {}),
        isClosed: status === "CLOSED_WON" || status === "CLOSED_LOST",
        closedDate: (status === "CLOSED_WON" || status === "CLOSED_LOST") ? new Date() : null,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update referral status:", error);
    return { success: false, error: "Failed to update referral status" };
  }
}
