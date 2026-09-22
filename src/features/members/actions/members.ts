"use server";

import { db } from "@/shared/lib/db";

export async function getMembers() {
  try {
    return await db.member.findMany({
      include: {
        organization: true,
        chapter: true,
        business: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

export async function getMemberProfile(memberId: string) {
  try {
    return await db.member.findUnique({
      where: { id: memberId },
      include: {
        organization: true,
        chapter: true,
        business: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch member profile:", error);
    return null;
  }
}

export async function updateMemberProfile(
  memberId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    businessName?: string;
    industry?: string;
    companyDescription?: string;
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    businessCategory?: string;
    businessLogo?: string;
  }
) {
  try {
    // 1. Update Member main details
    const member = await db.member.update({
      where: { id: memberId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        instagram: data.instagram,
      },
    });

    // 2. Upsert MemberBusiness profile
    if (data.businessName || data.companyDescription || data.industry || data.businessCategory) {
      await db.memberBusiness.upsert({
        where: { memberId },
        create: {
          memberId,
          businessName: data.businessName || `${member.firstName}'s Business`,
          industry: data.industry || null,
          companyDescription: data.companyDescription || null,
          businessAddress: data.businessAddress || null,
          businessPhone: data.businessPhone || null,
          businessEmail: data.businessEmail || null,
          businessCategory: data.businessCategory || null,
          businessLogo: data.businessLogo || null,
          website: data.website || null,
        },
        update: {
          businessName: data.businessName,
          industry: data.industry,
          companyDescription: data.companyDescription,
          businessAddress: data.businessAddress,
          businessPhone: data.businessPhone,
          businessEmail: data.businessEmail,
          businessCategory: data.businessCategory,
          businessLogo: data.businessLogo,
          website: data.website,
        },
      });
    }

    return { success: true, member };
  } catch (error) {
    console.error("Failed to update member profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

import { validateMemberEmail, provisionMemberAuthAccount } from "@/lib/auth/member-auth-sync";
import { MemberStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createMemberAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  chapterId: string;
  businessName?: string;
  industry?: string;
  initialPassword?: string;
  roleCode?: string;
}) {
  try {
    const { isValid, normalizedEmail, error: emailError } = validateMemberEmail(data.email);
    if (!isValid) {
      return { success: false, error: emailError || "Invalid email address format." };
    }

    const existing = await db.member.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
        deletedAt: null,
      },
    });
    if (existing) {
      return { success: false, error: `A member with email ${normalizedEmail} is already registered.` };
    }

    const chapter = await db.chapter.findUnique({ where: { id: data.chapterId } });
    if (!chapter) return { success: false, error: "Chapter not found." };

    const member = await db.member.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: normalizedEmail,
        phoneNumber: data.phoneNumber,
        chapterId: data.chapterId,
        organizationId: chapter.organizationId,
        status: MemberStatus.ACTIVE,
        membershipNumber: `GC-${chapter.chapterCode || "CHP"}-${Math.floor(100 + Math.random() * 900)}`,
        joinedAt: new Date(),
        business: {
          create: {
            businessName: data.businessName || `${data.firstName}'s Business`,
            industry: data.industry || "General Industry",
          },
        },
      },
    });

    // Provision auth credentials for BOTH Google OAuth and Password logins
    await provisionMemberAuthAccount({
      memberId: member.id,
      email: normalizedEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      initialPassword: data.initialPassword,
      roleCode: data.roleCode || "MEMBER",
    });

    revalidatePath("/dashboard/members");
    revalidatePath("/dashboard/admin/members");
    return { success: true, member };
  } catch (error: any) {
    console.error("Failed to create member:", error);
    return { success: false, error: error?.message || "Failed to create member." };
  }
}

