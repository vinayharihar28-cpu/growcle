"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  targetType: string;
  chapterId?: string | null;
  chapterName?: string | null;
  memberId?: string | null;
  isRead: boolean;
  createdAt: string;
}

/**
 * Fetch dynamic notifications for a member.
 * Returns notifications targeted to the member, their chapter, or platform-wide (ALL).
 */
export async function getMemberNotifications(
  memberId?: string,
  chapterId?: string
): Promise<NotificationItem[]> {
  try {
    const whereConditions: any[] = [{ chapterId: null }];

    if (chapterId && chapterId !== "all") {
      whereConditions.push({ chapterId });
    }

    if (memberId) {
      whereConditions.push({ memberId });
    }

    const records = await db.notification.findMany({
      where: {
        OR: whereConditions,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return records.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      type: n.type,
      targetType: n.memberId ? "MEMBER" : n.chapterId ? "CHAPTER" : "ALL",
      chapterId: n.chapterId,
      chapterName: null,
      memberId: n.memberId,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch member notifications:", error);
    return [];
  }
}

/**
 * Fetch dynamic notifications for Admin / Superiors.
 */
export async function getAdminNotificationsList(chapterId?: string): Promise<NotificationItem[]> {
  try {
    const where: any = {};
    if (chapterId && chapterId !== "all") {
      where.chapterId = chapterId;
    }

    const records = await db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return records.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      type: n.type,
      targetType: n.memberId ? "MEMBER" : n.chapterId ? "CHAPTER" : "ALL",
      chapterId: n.chapterId,
      chapterName: null,
      memberId: n.memberId,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch admin notifications:", error);
    return [];
  }
}

/**
 * Broadcast an announcement or alert to all members, a specific chapter, or role.
 */
export async function broadcastAdminNotification(data: {
  title: string;
  message: string;
  recipientType?: string;
  chapterId?: string;
  priority?: string;
}) {
  try {
    const created = await db.notification.create({
      data: {
        title: data.title,
        body: data.message,
        type: data.priority === "URGENT" ? "ALERT" : "BROADCAST",
        chapterId: data.chapterId && data.chapterId !== "all" ? data.chapterId : null,
        isRead: false,
      },
    });

    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard/member/notifications");
    revalidatePath("/dashboard/leadership/notifications");
    revalidatePath("/dashboard/director/notifications");
    return { success: true, notification: created };
  } catch (error) {
    console.error("Failed to broadcast notification:", error);
    throw new Error("Failed to broadcast notification");
  }
}

/**
 * Mark a notification as read.
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false };
  }
}

/**
 * Helper to dispatch programmatic notifications from actions (referral, tyfcb, meetings).
 */
export async function createSystemNotification(data: {
  title: string;
  message: string;
  type?: string;
  chapterId?: string;
  memberId?: string;
  userId?: string;
}) {
  try {
    return await db.notification.create({
      data: {
        title: data.title,
        body: data.message,
        type: data.type || "SYSTEM",
        chapterId: data.chapterId || null,
        memberId: data.memberId || null,
        userId: data.userId || null,
        isRead: false,
      },
    });
  } catch (e) {
    console.error("Could not write system notification", e);
  }
}
