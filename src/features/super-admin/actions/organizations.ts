"use server";

import { db } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";

export async function getOrganizations() {
  try {
    return await db.organization.findMany({
      include: {
        _count: {
          select: { chapters: true, members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Failed to fetch organizations");
  }
}

export async function updateOrganizationBranding(
  organizationId: string,
  data: { primaryColor?: string; logoUrl?: string; customDomain?: string }
) {
  try {
    const org = await db.organization.update({
      where: { id: organizationId },
      data,
    });
    
    revalidatePath("/dashboard/super-admin/organizations");
    revalidatePath("/dashboard/super-admin/branding");
    return org;
  } catch (error) {
    console.error("Error updating organization branding:", error);
    throw new Error("Failed to update organization branding");
  }
}
