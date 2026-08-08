"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";

export async function getOneToOnes(memberId: string) {
  try {
    const oneToOnes = await db.oneToOne.findMany({
      where: {
        OR: [
          { initiatorId: memberId },
          { receiverId: memberId },
        ],
      },
      include: {
        initiator: {
          select: { firstName: true, lastName: true, business: { select: { businessName: true } } },
        },
        receiver: {
          select: { firstName: true, lastName: true, business: { select: { businessName: true } } },
        },
      },
      orderBy: { date: "desc" },
    });

    return oneToOnes.map(oto => ({
      ...oto,
      initiator: {
        ...oto.initiator,
        businessName: oto.initiator.business?.businessName || null
      },
      receiver: {
        ...oto.receiver,
        businessName: oto.receiver.business?.businessName || null
      }
    }));
  } catch (error) {
    console.error("Error fetching 1-to-1s:", error);
    throw new Error("Failed to fetch 1-to-1s");
  }
}

export async function logOneToOne(data: {
  initiatorId: string;
  receiverId: string;
  date: Date;
  notes?: string;
}) {
  try {
    const oneToOne = await db.oneToOne.create({
      data: {
        initiatorId: data.initiatorId,
        receiverId: data.receiverId,
        date: data.date,
        notes: data.notes,
        status: "COMPLETED",
      },
    });

    revalidatePath("/dashboard/one-to-ones");
    return oneToOne;
  } catch (error) {
    console.error("Error logging 1-to-1:", error);
    throw new Error("Failed to log 1-to-1");
  }
}
