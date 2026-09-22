"use server";

import { db } from "@/shared/lib/db";
import { 
  MemberStatus, 
  VisitorStatus, 
  ReferralStatus, 
  MeetingStatus, 
  AttendanceStatus, 
  PaymentStatus 
} from "@prisma/client";
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
    // ignore outside request context
  }
  return undefined;
}

// -----------------------------------------------------------------------------
// 1. PLATFORM OVERVIEW & KPIS (Section 6 & 7)
// -----------------------------------------------------------------------------
export async function getAdminPlatformKPIs(chapterId?: string) {
  try {
    const effectiveChapterId = await getEffectiveChapterId(chapterId);
    const isChapterFiltered = !!effectiveChapterId;
    const chapterFilter = isChapterFiltered ? { id: effectiveChapterId } : {};
    const memberChapterFilter = isChapterFiltered ? { chapterId: effectiveChapterId } : {};
    const visitorChapterFilter = isChapterFiltered ? { chapterId: effectiveChapterId } : {};
    const referralChapterFilter = isChapterFiltered ? { chapterId: effectiveChapterId } : {};

    let memberIds: string[] | undefined = undefined;
    if (isChapterFiltered) {
      const chapterMembers = await db.member.findMany({
        where: { chapterId: effectiveChapterId },
        select: { id: true },
      });
      memberIds = chapterMembers.map((m) => m.id);
    }

    const [
      totalChapters,
      activeChapters,
      inactiveChapters,
      totalMembers,
      activeMembers,
      pendingMembers,
      inactiveMembers,
      totalVisitors,
      upcomingVisitors,
      attendedVisitors,
      convertedVisitors,
      totalReferrals,
      pendingReferrals,
      contactedReferrals,
      closedWonReferrals,
      closedLostReferrals,
      closedBusinessAgg,
      totalPaidInvoices,
      pendingInvoices,
      failedInvoices,
    ] = await Promise.all([
      db.chapter.count({ where: chapterFilter }),
      db.chapter.count({ where: { ...chapterFilter, isActive: true } }),
      db.chapter.count({ where: { ...chapterFilter, isActive: false } }),
      db.member.count({ where: memberChapterFilter }),
      db.member.count({ where: { ...memberChapterFilter, status: MemberStatus.ACTIVE } }),
      db.member.count({ where: { ...memberChapterFilter, status: MemberStatus.PENDING } }),
      db.member.count({ where: { ...memberChapterFilter, status: { in: [MemberStatus.INACTIVE, MemberStatus.SUSPENDED, MemberStatus.EXPIRED] } } }),
      db.visitor.count({ where: visitorChapterFilter }),
      db.visitor.count({ where: { ...visitorChapterFilter, status: VisitorStatus.PENDING } }),
      db.visitor.count({ where: { ...visitorChapterFilter, status: VisitorStatus.ATTENDED } }),
      db.visitor.count({ where: { ...visitorChapterFilter, status: VisitorStatus.CONVERTED } }),
      db.referral.count({ where: referralChapterFilter }),
      db.referral.count({ where: { ...referralChapterFilter, status: ReferralStatus.PENDING } }),
      db.referral.count({ where: { ...referralChapterFilter, status: ReferralStatus.CONTACTED } }),
      db.referral.count({ where: { ...referralChapterFilter, status: ReferralStatus.CLOSED_WON } }),
      db.referral.count({ where: { ...referralChapterFilter, status: ReferralStatus.CLOSED_LOST } }),
      db.referral.aggregate({
        where: { ...referralChapterFilter, status: ReferralStatus.CLOSED_WON },
        _sum: { value: true },
      }),
      db.invoice.aggregate({
        where: {
          status: PaymentStatus.SUCCEEDED,
          ...(memberIds ? { memberId: { in: memberIds } } : {}),
        },
        _sum: { total: true },
      }),
      db.invoice.aggregate({
        where: {
          status: PaymentStatus.PENDING,
          ...(memberIds ? { memberId: { in: memberIds } } : {}),
        },
        _sum: { total: true },
      }),
      db.invoice.aggregate({
        where: {
          status: PaymentStatus.FAILED,
          ...(memberIds ? { memberId: { in: memberIds } } : {}),
        },
        _sum: { total: true },
      }),
    ]);

    const totalClosedValue = Number(closedBusinessAgg._sum.value || 0);
    const collectedRevenue = Number(totalPaidInvoices._sum?.total || 0);
    const pendingRevenue = Number(pendingInvoices._sum?.total || 0);
    const outstandingRevenue = Number(failedInvoices._sum?.total || 0);

    return {
      chapters: {
        total: totalChapters,
        active: activeChapters,
        inactive: inactiveChapters,
      },
      members: {
        total: totalMembers,
        active: activeMembers,
        pending: pendingMembers,
        inactive: inactiveMembers,
      },
      visitors: {
        total: totalVisitors,
        upcoming: upcomingVisitors,
        attended: attendedVisitors,
        converted: convertedVisitors,
      },
      referrals: {
        total: totalReferrals,
        pending: pendingReferrals,
        contacted: contactedReferrals,
        closedWon: closedWonReferrals,
        closedLost: closedLostReferrals,
        totalClosedBusiness: totalClosedValue,
      },
      payments: {
        totalCollected: collectedRevenue,
        pending: pendingRevenue,
        outstanding: outstandingRevenue,
      },
    };
  } catch (error) {
    console.error("[AdminActions] Error in getAdminPlatformKPIs:", error);
    return {
      chapters: { total: 0, active: 0, inactive: 0 },
      members: { total: 0, active: 0, pending: 0, inactive: 0 },
      visitors: { total: 0, upcoming: 0, attended: 0, converted: 0 },
      referrals: { total: 0, pending: 0, contacted: 0, closedWon: 0, closedLost: 0, totalClosedBusiness: 0 },
      payments: { totalCollected: 0, pending: 0, outstanding: 0 },
    };
  }
}

// -----------------------------------------------------------------------------
// 2. CHAPTER MANAGEMENT & PERFORMANCE (Section 9, 10, 11)
// -----------------------------------------------------------------------------
export async function getAdminChaptersList() {
  try {
    const chapters = await db.chapter.findMany({
      orderBy: { name: "asc" },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: {
              include: {
                role: true,
              },
            },
            status: true,
          },
        },
        visitors: {
          select: { id: true, status: true },
        },
        referrals: {
          where: { status: ReferralStatus.CLOSED_WON },
          select: { value: true },
        },
        meetings: {
          where: { date: { gte: new Date() } },
          orderBy: { date: "asc" },
          take: 1,
          select: { id: true, title: true, date: true, startTime: true },
        },
      },
    });

    return chapters.map((chap) => {
      const activeMembers = chap.members.filter((m) => m.status === MemberStatus.ACTIVE);
      const president = chap.members.find(
        (m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president")
      );
      const vp = chap.members.find(
        (m) => m.roles.some((r) => r.role.name === "VICE_PRESIDENT") || m.email.includes("vp")
      );
      const treasurer = chap.members.find(
        (m) => m.roles.some((r) => r.role.name === "TREASURER") || m.email.includes("treasurer")
      );
      const director = chap.members.find(
        (m) => m.roles.some((r) => r.role.name === "DIRECTOR") || m.email.includes("director")
      );

      const closedValue = chap.referrals.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
      const convertedVisitors = chap.visitors.filter((v) => v.status === VisitorStatus.CONVERTED).length;
      const totalVisitors = chap.visitors.length;
      const conversionRate = totalVisitors > 0 ? Math.round((convertedVisitors / totalVisitors) * 100) : 0;

      return {
        id: chap.id,
        name: chap.name,
        chapterCode: chap.chapterCode || `CHP-${chap.id.substring(0, 4).toUpperCase()}`,
        region: chap.region || "Primary Region",
        location: chap.meetingLocation || "Business Center",
        meetingDay: chap.meetingDay || "Wednesday",
        meetingTime: chap.meetingTime || "07:30 AM",
        isActive: chap.isActive,
        themeColor: (chap as any).themeColor || "emerald",
        upiId: (chap as any).upiId || "",
        upiName: (chap as any).upiName || "",
        meetingFee: (chap as any).meetingFee || 800,
        activeMembersCount: activeMembers.length,
        totalMembersCount: chap.members.length,
        directorName: director ? `${director.firstName} ${director.lastName}` : "Unassigned",
        presidentName: president ? `${president.firstName} ${president.lastName}` : "Unassigned",
        vpName: vp ? `${vp.firstName} ${vp.lastName}` : "Unassigned",
        treasurerName: treasurer ? `${treasurer.firstName} ${treasurer.lastName}` : "Unassigned",
        nextMeeting: chap.meetings[0]
          ? `${new Date(chap.meetings[0].date).toLocaleDateString()} at ${chap.meetings[0].startTime}`
          : "None scheduled",
        closedBusiness: closedValue,
        visitorCount: totalVisitors,
        visitorConversionRate: conversionRate,
        attendanceRate: 0,
      };
    });
  } catch (error) {
    console.error("[AdminActions] Error in getAdminChaptersList:", error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// 3. DIRECTOR MANAGEMENT (Section 12)
// -----------------------------------------------------------------------------
export async function getAdminDirectors() {
  try {
    const directorMembers = await db.member.findMany({
      where: {
        roles: {
          some: {
            role: { name: "DIRECTOR" },
          },
        },
      },
      include: {
        chapter: true,
        roles: {
          include: { role: true },
        },
      },
      orderBy: { firstName: "asc" },
    });

    return directorMembers.map((dm) => ({
      id: dm.id,
      firstName: dm.firstName,
      lastName: dm.lastName,
      email: dm.email,
      status: dm.status,
      assignedChapters: dm.chapter ? [dm.chapter.name] : [],
      totalChapters: dm.chapter ? 1 : 0,
      dateAssigned: dm.joinedAt ? new Date(dm.joinedAt).toLocaleDateString("en-IN") : "Recent",
      lastActivity: "Active",
    }));
  } catch (error) {
    console.error("[AdminActions] Error in getAdminDirectors:", error);
    return [];
  }
}

export async function assignMemberAsDirector(memberId: string, chapterId?: string) {
  try {
    const role = await db.role.upsert({
      where: { name: "DIRECTOR" },
      create: { name: "DIRECTOR", description: "Regional Chapter Director" },
      update: {},
    });

    await db.memberRole.upsert({
      where: {
        memberId_roleId: {
          memberId,
          roleId: role.id,
        },
      },
      create: {
        memberId,
        roleId: role.id,
      },
      update: {},
    });

    if (chapterId) {
      await db.member.update({
        where: { id: memberId },
        data: { chapterId },
      });
    }

    revalidatePath("/dashboard/admin/directors");
    revalidatePath("/dashboard/director");
    return { success: true };
  } catch (error) {
    console.error("[AdminActions] Error in assignMemberAsDirector:", error);
    return { success: false, error: "Failed to assign director" };
  }
}

export async function assignDirectorChapters(directorId: string, chapterNames: string[]) {
  try {
    await db.auditLog.create({
      data: {
        who: "Admin",
        action: "ASSIGN_DIRECTOR_CHAPTERS",
        entity: "Director",
        entityId: directorId,
        newValue: { assignedChapters: chapterNames },
      },
    });

    revalidatePath("/dashboard/admin/directors");
    return { success: true, message: "Director assignments updated successfully" };
  } catch (error) {
    console.error("[AdminActions] Error in assignDirectorChapters:", error);
    return { success: false, error: "Failed to update assignments" };
  }
}

// -----------------------------------------------------------------------------
// 4. LEADERSHIP MANAGEMENT (Section 13)
// -----------------------------------------------------------------------------
export async function getAdminLeadershipAssignments() {
  try {
    const chapters = await db.chapter.findMany({
      orderBy: { name: "asc" },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    return chapters.map((c) => {
      const pres = c.members.find(
        (m) => m.roles.some((r) => r.role.name === "PRESIDENT") || m.email.includes("president")
      );
      const vp = c.members.find(
        (m) => m.roles.some((r) => r.role.name === "VICE_PRESIDENT") || m.email.includes("vp")
      );
      const tres = c.members.find(
        (m) => m.roles.some((r) => r.role.name === "TREASURER") || m.email.includes("treasurer")
      );

      return {
        chapterId: c.id,
        chapterName: c.name,
        president: pres ? { id: pres.id, name: `${pres.firstName} ${pres.lastName}`, email: pres.email } : null,
        vicePresident: vp ? { id: vp.id, name: `${vp.firstName} ${vp.lastName}`, email: vp.email } : null,
        treasurer: tres ? { id: tres.id, name: `${tres.firstName} ${tres.lastName}`, email: tres.email } : null,
      };
    });
  } catch (error) {
    console.error("[AdminActions] Error in getAdminLeadershipAssignments:", error);
    return [];
  }
}

export async function updateLeadershipRole(chapterId: string, memberId: string, roleTitle: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER") {
  try {
    const role = await db.role.upsert({
      where: { name: roleTitle },
      create: { name: roleTitle, description: `Chapter ${roleTitle}` },
      update: {},
    });

    await db.memberRole.upsert({
      where: {
        memberId_roleId: {
          memberId,
          roleId: role.id,
        },
      },
      create: {
        memberId,
        roleId: role.id,
      },
      update: {},
    });

    await db.auditLog.create({
      data: {
        who: "Admin",
        action: "UPDATE_LEADERSHIP_ROLE",
        entity: "Member",
        entityId: memberId,
        newValue: { chapterId, role: roleTitle },
      },
    });

    revalidatePath("/dashboard/admin/leadership");
    revalidatePath("/dashboard/leadership");
    return { success: true };
  } catch (error) {
    console.error("[AdminActions] Error in updateLeadershipRole:", error);
    return { success: false, error: "Failed to update leadership role" };
  }
}

// -----------------------------------------------------------------------------
// 5. ATTENDANCE TRACKING & CORRECTIONS (Section 24)
// -----------------------------------------------------------------------------
export async function getAdminAttendanceData(chapterId?: string) {
  try {
    const effectiveChapterId = await getEffectiveChapterId(chapterId);
    const chapters = await db.chapter.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    const selectedChapterId = effectiveChapterId || chapters[0]?.id;

    const meetings = selectedChapterId
      ? await db.meeting.findMany({
          where: { chapterId: selectedChapterId },
          orderBy: { date: "desc" },
          take: 5,
          include: {
            attendances: {
              include: {
                member: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
            },
          },
        })
      : [];

    return {
      chapters,
      selectedChapterId,
      meetings: meetings.map((m) => {
        const total = m.attendances.length;
        const present = m.attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
        const substitute = m.attendances.filter((a) => a.status === AttendanceStatus.SUBSTITUTE).length;
        const absent = m.attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;
        const excused = m.attendances.filter((a) => a.status === AttendanceStatus.EXCUSED).length;
        const rate = total > 0 ? Math.round(((present + substitute) / total) * 100) : 0;

        return {
          id: m.id,
          title: m.title,
          date: m.date.toISOString(),
          startTime: m.startTime,
          location: m.location,
          status: m.status,
          totalMembers: total,
          present: present,
          substitute: substitute,
          absent: absent,
          excused: excused,
          rate: rate,
          records: m.attendances.map((rec) => ({
            id: rec.id,
            memberId: rec.memberId || "",
            memberName: rec.member ? `${rec.member.firstName} ${rec.member.lastName}` : "Guest / Visitor",
            email: rec.member?.email || "",
            status: rec.status,
          })),
        };
      }),
    };
  } catch (error) {
    console.error("[AdminActions] Error in getAdminAttendanceData:", error);
    return { chapters: [], selectedChapterId: "", meetings: [] };
  }
}

export async function correctAttendanceRecord(attendanceId: string, newStatus: AttendanceStatus) {
  try {
    await db.meetingAttendance.update({
      where: { id: attendanceId },
      data: { status: newStatus },
    });

    await db.auditLog.create({
      data: {
        who: "Admin",
        action: "CORRECT_ATTENDANCE",
        entity: "MeetingAttendance",
        entityId: attendanceId,
        newValue: { status: newStatus },
      },
    });

    revalidatePath("/dashboard/attendance");
    return { success: true };
  } catch (error) {
    console.error("[AdminActions] Error in correctAttendanceRecord:", error);
    return { success: false, error: "Failed to correct attendance record" };
  }
}

// -----------------------------------------------------------------------------
// 6. PAYMENTS & TRANSACTIONS (Section 27)
// -----------------------------------------------------------------------------
export async function getAdminPaymentsData(chapterId?: string) {
  try {
    const effectiveChapterId = await getEffectiveChapterId(chapterId);
    let memberIds: string[] | undefined = undefined;
    if (effectiveChapterId) {
      const chapterMembers = await db.member.findMany({
        where: { chapterId: effectiveChapterId },
        select: { id: true },
      });
      memberIds = chapterMembers.map((m) => m.id);
    }

    const invoices = await db.invoice.findMany({
      where: memberIds ? { memberId: { in: memberIds } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const memberIdList = invoices.map((i) => i.memberId).filter((id): id is string => !!id);
    const members = memberIdList.length > 0
      ? await db.member.findMany({
          where: { id: { in: memberIdList } },
          include: { chapter: true },
        })
      : [];
    const memberMap = new Map(members.map((m) => [m.id, m]));

    const totalCollected = invoices
      .filter((i) => i.status === PaymentStatus.SUCCEEDED)
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const pending = invoices
      .filter((i) => i.status === PaymentStatus.PENDING)
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const failed = invoices
      .filter((i) => i.status === PaymentStatus.FAILED)
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

    const paymentsList = invoices.map((inv) => {
      const m = inv.memberId ? memberMap.get(inv.memberId) : null;
      return {
        id: inv.invoiceNumber || `INV-${inv.id.substring(0, 6)}`,
        member: m ? `${m.firstName} ${m.lastName}` : "Member",
        chapter: m?.chapter?.name || "Chapter",
        amount: Number(inv.total) || 0,
        status: inv.status,
        date: inv.createdAt.toISOString().split("T")[0],
        method: "Online UPI / Net Banking",
        reference: inv.id,
      };
    });

    return {
      kpis: {
        totalCollected,
        pending,
        failed,
        outstanding: failed,
      },
      payments: paymentsList,
    };
  } catch (error) {
    console.error("[AdminActions] Error in getAdminPaymentsData:", error);
    return {
      kpis: { totalCollected: 0, pending: 0, failed: 0, outstanding: 0 },
      payments: [],
    };
  }
}

export async function recordAdminManualPayment(data: {
  memberName: string;
  chapterName: string;
  amount: number;
  paymentMethod: string;
  reference: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        who: "Admin",
        action: "RECORD_MANUAL_PAYMENT",
        entity: "Payment",
        newValue: data,
      },
    });

    revalidatePath("/dashboard/payments");
    return { success: true };
  } catch (error) {
    console.error("[AdminActions] Error in recordAdminManualPayment:", error);
    return { success: false, error: "Failed to record payment" };
  }
}

import {
  getAdminNotificationsList as _getAdminNotificationsList,
  broadcastAdminNotification as _broadcastAdminNotification,
  markNotificationAsRead as _markNotificationAsRead,
} from "@/features/notifications/actions/notification-actions";

export async function getAdminNotificationsList(chapterId?: string) {
  return _getAdminNotificationsList(chapterId);
}

export async function broadcastAdminNotification(data: {
  title: string;
  message: string;
  recipientType?: string;
  chapterId?: string;
  priority?: string;
}) {
  return _broadcastAdminNotification(data);
}

export async function markNotificationAsRead(notificationId: string) {
  return _markNotificationAsRead(notificationId);
}

// -----------------------------------------------------------------------------
// 8. AUDIT LOGS (Section 32)
// -----------------------------------------------------------------------------
export async function getAdminAuditLogsList(filterAction?: string) {
  try {
    const logs = await db.auditLog.findMany({
      where: filterAction && filterAction !== "ALL" ? { action: filterAction } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return logs.map((l) => ({
      id: l.id,
      actor: l.who || "System Admin",
      action: l.action,
      entity: l.entity,
      entityId: l.entityId || "N/A",
      timestamp: l.createdAt.toISOString(),
      ipAddress: l.ipAddress || "127.0.0.1",
      result: "SUCCESS",
    }));
  } catch (error) {
    console.error("[AdminActions] Error in getAdminAuditLogsList:", error);
    return [];
  }
}
