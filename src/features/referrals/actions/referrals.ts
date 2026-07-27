"use server";

import { db } from "@/shared/lib/db";

export async function getReferrals() {
  try {
    return await db.referral.findMany({
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

export async function createReferral(data: any) {
  try {
    const referral = await db.referral.create({
      data: {
        fromMemberId: data.fromMemberId,
        toMemberId: data.toMemberId,
        chapterId: data.chapterId,
        referralName: data.referralName,
        referralEmail: data.referralEmail,
        referralPhone: data.referralPhone,
        notes: data.notes,
        value: data.value ? parseFloat(data.value) : null,
      }
    });
    return { success: true, data: referral };
  } catch (error) {
    console.error("Failed to create referral:", error);
    return { success: false, error: "Failed to create referral" };
  }
}
