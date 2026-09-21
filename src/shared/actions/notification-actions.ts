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
 * Retrieves notifications for the active session user.
 * Seeds initial welcome alerts if none exist yet.
 */
export async function getHeaderNotifications(): Promise<HeaderNotification[]> {
  const session = await getCurrentSession();
  if (!session?.user?.id) return [];

  let notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  // If no notifications exist for this user, seed useful default alerts
  if (notifications.length === 0) {
    const defaultAlerts = [
      {
        userId: session.user.id,
        title: "Welcome to Growcle Workspace",
        body: "Your account is active with full workspace privileges. Switch roles anytime in the header.",
        type: "SYSTEM",
        isRead: false,
      },
      {
        userId: session.user.id,
        title: "Chapter Synchronization Active",
        body: "2 chapters registered: Apex Central Chapter (APX-01) & Silicon Valley Founders (SVF-02).",
        type: "CHAPTER",
        isRead: false,
      },
      {
        userId: session.user.id,
        title: "Next Chapter Meeting Scheduled",
        body: "Upcoming chapter meeting scheduled for Wednesday at 07:30 AM.",
        type: "MEETING",
        isRead: true,
      },
    ];

    for (const alert of defaultAlerts) {
      await db.notification.create({ data: alert });
    }

    notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 15,
    });
  }

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
    where: { id: notificationId, userId: session.user.id },
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
    where: { userId: session.user.id, isRead: false },
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
    where: { userId: session.user.id },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Create a live test notification
 */
export async function createTestNotification() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return { success: false };

  const testAlerts = [
    {
      title: "New Visitor Registered",
      body: "Rajesh Sharma from Apex Tech has registered to attend the next chapter meeting.",
      type: "VISITOR",
    },
    {
      title: "Referral Received",
      body: "You received a new high-intent business referral from Silicon Valley Founders.",
      type: "REFERRAL",
    },
    {
      title: "Meeting Attendance Reminder",
      body: "Weekly chapter meeting begins in 24 hours. Verify your attendance roster.",
      type: "MEETING",
    },
  ];

  const randomAlert = testAlerts[Math.floor(Math.random() * testAlerts.length)];

  await db.notification.create({
    data: {
      userId: session.user.id,
      title: randomAlert.title,
      body: randomAlert.body,
      type: randomAlert.type,
      isRead: false,
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
