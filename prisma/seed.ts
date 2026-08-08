import { db as prisma } from '../src/shared/lib/db';
import { PERMISSIONS, ALL_PERMISSIONS } from '../src/features/authorization/constants/permissions';
import { ROLES } from '../src/features/authorization/constants/roles';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Permissions
  console.log('Seeding Permissions...');
  for (const permissionSlug of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action: permissionSlug },
      update: {},
      create: {
        action: permissionSlug,
        description: `System permission for ${permissionSlug}`,
      },
    });
  }

  // 2. Seed Roles
  console.log('Seeding Default Roles...');
  const rolesToSeed = [
    { name: ROLES.PLATFORM_ADMIN, description: 'Super administrator with full access to everything.' },
    { name: ROLES.ORGANIZATION_ADMIN, description: 'Administrator for an entire Organization.' },
    { name: ROLES.CHAPTER_ADMIN, description: 'Administrator for a specific Chapter.' },
    { name: ROLES.CHAPTER_OFFICER, description: 'Officer assisting with Chapter management.' },
    { name: ROLES.MEMBER, description: 'Standard networking member.' },
  ];

  for (const roleData of rolesToSeed) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description },
      create: {
        name: roleData.name,
        description: roleData.description,
      },
    });
  }

  // Helper to assign permissions to a role
  const assignPermissions = async (roleName: string, permissionActions: string[]) => {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) return;

    for (const pAction of permissionActions) {
      const permission = await prisma.permission.findUnique({ where: { action: pAction } });
      if (!permission) continue;

      // Check if assignment exists
      const exists = await prisma.rolePermission.findFirst({
        where: { roleId: role.id, permissionId: permission.id },
      });

      if (!exists) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  };

  // 3. Define Role-Permission Mappings
  console.log('Assigning Permissions to Roles...');

  // PLATFORM_ADMIN gets absolutely everything
  await assignPermissions(ROLES.PLATFORM_ADMIN, [...ALL_PERMISSIONS]);

  // ORGANIZATION_ADMIN
  const orgAdminPerms = [
    PERMISSIONS.ORG.UPDATE,
    PERMISSIONS.ORG.VIEW,
    PERMISSIONS.CHAPTER.CREATE,
    PERMISSIONS.CHAPTER.UPDATE,
    PERMISSIONS.CHAPTER.DELETE,
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEMBER.CREATE,
    PERMISSIONS.MEMBER.INVITE,
    PERMISSIONS.MEMBER.UPDATE,
    PERMISSIONS.MEMBER.DELETE,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.FINANCE.MANAGE,
    PERMISSIONS.FINANCE.VIEW,
    PERMISSIONS.REPORT.VIEW,
    PERMISSIONS.AUDIT.VIEW,
  ];
  await assignPermissions(ROLES.ORGANIZATION_ADMIN, orgAdminPerms);

  // CHAPTER_ADMIN
  const chapterAdminPerms = [
    PERMISSIONS.CHAPTER.UPDATE,
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEMBER.INVITE,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEETING.CREATE,
    PERMISSIONS.MEETING.UPDATE,
    PERMISSIONS.MEETING.DELETE,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.ATTENDANCE.MANAGE,
    PERMISSIONS.ATTENDANCE.VIEW,
    PERMISSIONS.REFERRAL.VIEW,
    PERMISSIONS.REPORT.VIEW,
  ];
  await assignPermissions(ROLES.CHAPTER_ADMIN, chapterAdminPerms);

  // CHAPTER_OFFICER
  const chapterOfficerPerms = [
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEETING.UPDATE,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.ATTENDANCE.MANAGE,
    PERMISSIONS.ATTENDANCE.VIEW,
    PERMISSIONS.MEMBER.VIEW,
  ];
  await assignPermissions(ROLES.CHAPTER_OFFICER, chapterOfficerPerms);

  // MEMBER
  const memberPerms = [
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.REFERRAL.CREATE,
    PERMISSIONS.REFERRAL.UPDATE,
    PERMISSIONS.REFERRAL.VIEW,
  ];
  await assignPermissions(ROLES.MEMBER, memberPerms);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
