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
