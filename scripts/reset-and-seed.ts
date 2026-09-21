import { db } from "../src/shared/lib/db";
import bcrypt from "bcryptjs";
import { ALL_PERMISSIONS } from "../src/features/authorization/constants/permissions";
import { ROLES } from "../src/features/authorization/constants/roles";

async function main() {
  console.log("🧹 Starting full database purge and clean reset...");

  // 1. Delete all transactional, relational and user data
  console.log("Deleting old records...");
  await db.transaction.deleteMany().catch(() => {});
  await db.invoice.deleteMany().catch(() => {});
  await db.payment.deleteMany().catch(() => {});
  await db.referral.deleteMany().catch(() => {});
  await db.oneToOne.deleteMany().catch(() => {});
  await db.meetingAttendance.deleteMany().catch(() => {});
  await db.meeting.deleteMany().catch(() => {});
  await db.visitor.deleteMany().catch(() => {});
  await db.notification.deleteMany().catch(() => {});
  await db.memberBusiness.deleteMany().catch(() => {});
  await db.memberRole.deleteMany().catch(() => {});
  await db.invitation.deleteMany().catch(() => {});
  await db.member.deleteMany().catch(() => {});
  await db.session.deleteMany().catch(() => {});
  await db.account.deleteMany().catch(() => {});
  await db.user.deleteMany().catch(() => {});
  await db.chapter.deleteMany().catch(() => {});
  await db.organizationSettings.deleteMany().catch(() => {});
  await db.organization.deleteMany().catch(() => {});

  console.log("✅ All old mock and user records purged.");

  // 2. Seed Permissions
  console.log("Seeding system permissions...");
  for (const perm of ALL_PERMISSIONS) {
    await db.permission.upsert({
      where: { action: perm },
      update: {},
      create: {
        action: perm,
        description: `System permission for ${perm}`,
      },
    });
  }

  // 3. Seed System Roles
  console.log("Seeding system roles...");
  const roleDefs = [
    { name: ROLES.PLATFORM_ADMIN, description: "Super administrator with complete platform access." },
    { name: ROLES.ORGANIZATION_ADMIN, description: "Administrator for the organization." },
    { name: "DIRECTOR", description: "Regional Chapter Director overseeing assigned chapters." },
    { name: "PRESIDENT", description: "Chapter President leading chapter leadership team." },
    { name: ROLES.CHAPTER_ADMIN, description: "Administrator for a specific chapter." },
    { name: ROLES.CHAPTER_OFFICER, description: "Leadership team officer assisting chapter operations." },
    { name: ROLES.MEMBER, description: "Standard networking chapter member." },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of roleDefs) {
    const roleRecord = await db.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleMap[r.name] = roleRecord.id;
  }

  // Assign all permissions to PLATFORM_ADMIN
  const allDbPerms = await db.permission.findMany();
  for (const p of allDbPerms) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleMap[ROLES.PLATFORM_ADMIN],
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: roleMap[ROLES.PLATFORM_ADMIN],
        permissionId: p.id,
      },
    });
  }

  // 4. Create Primary Organization
  console.log("Creating primary organization...");
  const org = await db.organization.create({
    data: {
      name: "Growcle Apex Network",
      slug: "growcle-apex",
      primaryColor: "#4f46e5",
      country: "India",
      currency: "INR",
    },
  });

  // 5. Create Initial Clean Chapters
  console.log("Creating clean initial chapters...");
  const chapterAlpha = await db.chapter.create({
    data: {
      name: "Apex Central Chapter",
      chapterCode: "APX-01",
      region: "Bangalore Central",
      meetingDay: "Wednesday",
      meetingTime: "07:30 AM",
      meetingLocation: "Grand Executive Business Suite, MG Road",
      themeColor: "emerald",
      isActive: true,
      organizationId: org.id,
    },
  });

  const chapterBeta = await db.chapter.create({
    data: {
      name: "Silicon Valley Founders",
      chapterCode: "SVF-02",
      region: "Tech Corridor",
      meetingDay: "Thursday",
      meetingTime: "08:00 AM",
      meetingLocation: "Innovation Hub Conference Center",
      themeColor: "purple",
      isActive: true,
      organizationId: org.id,
    },
  });

  // 6. Create Master SuperAdmin User
  console.log("Creating master user vinayharihar28@gmail.com...");
  const email = "vinayharihar28@gmail.com";
  const passwordHash = await bcrypt.hash("vinay@admin", 10);

  const user = await db.user.create({
    data: {
      name: "Vinay Harihar",
      email,
      emailVerified: true,
    },
  });

  // Better Auth Account
  await db.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: passwordHash,
      issuer: "local:credential",
    },
  });

  // Primary Member Profile for Master User
  const member = await db.member.create({
    data: {
      userId: user.id,
      firstName: "Vinay",
      lastName: "Harihar",
      email,
      phoneNumber: "+91 98765 43210",
      status: "ACTIVE",
      membershipNumber: "GC-APX-001",
      organizationId: org.id,
      chapterId: chapterAlpha.id,
      joinedAt: new Date(),
    },
  });

  // Business profile for Master Member
  await db.memberBusiness.create({
    data: {
      memberId: member.id,
      businessName: "Growcle Enterprise Advisory",
      industry: "Technology & Business Consulting",
      businessCategory: "SaaS & Growth Architecture",
      companyDescription: JSON.stringify({
        description: "Enterprise advisory for scaling high-trust business networking ecosystems.",
        whatIDo: "Architect scalable B2B growth and digital networking workflows.",
        whoIHelp: "Enterprise founders, directors, and chapter leadership teams.",
        bestReferral: "Organizations seeking structured referral automation and member portals.",
        notAGoodReferral: "Informal hobby clubs without structured business governance.",
      }),
      businessAddress: "Bangalore Central Business District",
      businessPhone: "+91 98765 43210",
      businessEmail: email,
      website: "https://growcle.com",
    },
  });

  // Assign PLATFORM_ADMIN role
  await db.memberRole.create({
    data: {
      memberId: member.id,
      roleId: roleMap[ROLES.PLATFORM_ADMIN],
    },
  });
}

main()
  .catch((e) => {
    console.error("Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
