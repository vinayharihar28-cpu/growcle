"use server";

import { db } from "@/shared/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export interface HeaderNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  timeAgo: string;
}

function getTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Retrieves authentic notifications for the active session user and their chapter context.
 */
export async function getHeaderNotifications(): Promise<HeaderNotification[]> {
  const session = await getCurrentSession();
  if (!session?.user?.id) return [];

  // Find member to check their chapter
  const member = await db.member.findFirst({
    where: {
      OR: [
        { userId: session.user.id },
        { email: session.user.email },
      ],
    },
    select: { id: true, chapterId: true },
  });

  const orConditions: any[] = [
    { userId: session.user.id },
  ];

  if (member?.id) {
    orConditions.push({ memberId: member.id });
  }

  if (member?.chapterId) {
    orConditions.push({ chapterId: member.chapterId });
  } else {
    orConditions.push({ chapterId: null });
  }

  const notifications = await db.notification.findMany({
    where: {
      OR: orConditions,
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return notifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    type: n.type,
    isRead: n.isRead,
    timeAgo: getTimeAgo(n.createdAt),
  }));
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const session = await getCurrentSession();
  if (!session?.user?.id) return { success: false };

  await db.notification.updateMany({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Mark all notifications for user as read
 */
export async function markAllNotificationsAsRead() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return { success: false };

  await db.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Clear all notifications for user
 */
export async function clearAllNotifications() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return { success: false };

  await db.notification.deleteMany({
    where: {
      OR: [
        { userId: session.user.id },
        { isRead: true },
      ],
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

