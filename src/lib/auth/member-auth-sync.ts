import { db } from "@/shared/lib/db";
import bcrypt from "bcryptjs";

export const DEFAULT_MEMBER_INITIAL_PASSWORD = "password";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email address format strictly and returns a normalized version.
 */
export function validateMemberEmail(email: string): { isValid: boolean; normalizedEmail: string; error?: string } {
  if (!email || typeof email !== "string") {
    return { isValid: false, normalizedEmail: "", error: "Email address is required." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 255) {
    return { isValid: false, normalizedEmail, error: "Email address cannot exceed 255 characters." };
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { isValid: false, normalizedEmail, error: "Please enter a valid email address (e.g. name@company.com)." };
  }

  return { isValid: true, normalizedEmail };
}

/**
 * Checks if an email belongs to a pre-registered, active member in the database.
 */
export async function isRegisteredMember(email: string) {
  const { isValid, normalizedEmail } = validateMemberEmail(email);
  if (!isValid) return null;

  const member = await db.member.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      deletedAt: null,
    },
    include: {
      chapter: { select: { id: true, name: true, chapterCode: true } },
      roles: { include: { role: true } },
    },
  });

  return member;
}

/**
 * Provisions or synchronizes a Member's Auth credentials so they can log in via BOTH:
 * 1. Google OAuth (matching their verified email)
 * 2. Email & Password (using the provided or standard initial password)
 */
export async function provisionMemberAuthAccount(params: {
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  initialPassword?: string;
  roleCode?: string;
}) {
  const { isValid, normalizedEmail, error } = validateMemberEmail(params.email);
  if (!isValid) {
    throw new Error(error || "Invalid member email address.");
  }

  const fullName = `${params.firstName.trim()} ${params.lastName.trim()}`.trim() || "Member";
  const rawPassword = params.initialPassword || DEFAULT_MEMBER_INITIAL_PASSWORD;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Ensure User record exists in 'user' table
  const user = await db.user.upsert({
    where: { email: normalizedEmail },
    create: {
      id: crypto.randomUUID(),
      name: fullName,
      email: normalizedEmail,
      emailVerified: true,
    },
    update: {
      name: fullName,
    },
  });

  // 2. Link Member to this User
  await db.member.update({
    where: { id: params.memberId },
    data: { userId: user.id },
  });

  // 3. Ensure a password credential Account exists in 'account' table for Email/Password sign in
  const existingCredentialAccount = await db.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credential",
    },
  });

  if (!existingCredentialAccount) {
    await db.account.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });
  } else if (params.initialPassword) {
    // If an explicit new password was requested, update it
    await db.account.update({
      where: { id: existingCredentialAccount.id },
      data: { password: hashedPassword },
    });
  }

  // 4. Ensure canonical Role is assigned in 'memberRole'
  const roleCodeToAssign = params.roleCode || "MEMBER";
  const role = await db.role.findFirst({
    where: { name: { equals: roleCodeToAssign, mode: "insensitive" } },
  });

  if (role) {
    const existingMemberRole = await db.memberRole.findUnique({
      where: {
        memberId_roleId: {
          memberId: params.memberId,
          roleId: role.id,
        },
      },
    });

    if (!existingMemberRole) {
      await db.memberRole.create({
        data: {
          memberId: params.memberId,
          roleId: role.id,
        },
      });
    }
  }

  return {
    success: true,
    userId: user.id,
    email: normalizedEmail,
    initialPassword: rawPassword,
  };
}

/**
 * Syncs any existing members in the database who don't have a linked User or password account.
 */
export async function syncExistingMembersAuth() {
  const members = await db.member.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userId: true,
    },
  });

  const results = [];
  for (const member of members) {
    try {
      const res = await provisionMemberAuthAccount({
        memberId: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
      });
      results.push({ email: member.email, success: true, userId: res.userId });
    } catch (e: any) {
      console.warn(`[syncExistingMembersAuth] Could not provision member ${member.email}:`, e?.message);
    }
  }

  return results;
}
