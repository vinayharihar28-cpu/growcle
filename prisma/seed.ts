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
    { name: 'ADMIN', description: 'Full system administration, global chapters governance, financials, and configurations.' },
    { name: 'DIRECTOR', description: 'Regional chapter oversight, assigning leadership teams, and performance monitoring.' },
    { name: 'LEADERSHIP_TEAM', description: 'Chapter executive officers (President, VP, Secretary-Treasurer) managing weekly operations.' },
    { name: 'MEMBER', description: 'Active chapter members passing referrals, participating in 1-to-1s, and closing business.' },
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

  // ADMIN gets all permissions
  await assignPermissions('ADMIN', [...ALL_PERMISSIONS]);

  // DIRECTOR
  const directorPerms = [
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.CHAPTER.UPDATE,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEMBER.INVITE,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.ATTENDANCE.VIEW,
    PERMISSIONS.REFERRAL.VIEW,
    PERMISSIONS.FINANCE.VIEW,
    PERMISSIONS.REPORT.VIEW,
  ];
  await assignPermissions('DIRECTOR', directorPerms);

  // LEADERSHIP_TEAM
  const leadershipPerms = [
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEMBER.INVITE,
    PERMISSIONS.MEMBER.UPDATE,
    PERMISSIONS.MEETING.CREATE,
    PERMISSIONS.MEETING.UPDATE,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.ATTENDANCE.MANAGE,
    PERMISSIONS.ATTENDANCE.VIEW,
    PERMISSIONS.REFERRAL.CREATE,
    PERMISSIONS.REFERRAL.UPDATE,
    PERMISSIONS.REFERRAL.VIEW,
    PERMISSIONS.REPORT.VIEW,
  ];
  await assignPermissions('LEADERSHIP_TEAM', leadershipPerms);

  // MEMBER
  const memberPerms = [
    PERMISSIONS.CHAPTER.VIEW,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEETING.VIEW,
    PERMISSIONS.ATTENDANCE.VIEW,
    PERMISSIONS.REFERRAL.CREATE,
    PERMISSIONS.REFERRAL.UPDATE,
    PERMISSIONS.REFERRAL.VIEW,
  ];
  await assignPermissions('MEMBER', memberPerms);

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
