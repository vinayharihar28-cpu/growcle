import { db } from "@/shared/lib/db";

export async function authorize({
  userId,
  permission,
  resourceChapterId,
  organizationId,
  resourceOwnerId,
}: {
  userId: string;
  permission: string;
  resourceChapterId?: string | null;
  organizationId?: string | null;
  resourceOwnerId?: string | null;
}) {
  // Fetch member and roles
  const member = await db.member.findFirst({ where: { userId } });
  if (!member) return false;

  // Tenant isolation: user must belong to same organization (or chapter when provided)
  if (organizationId && member.organizationId !== organizationId) return false;
  if (resourceChapterId && member.chapterId && member.chapterId !== resourceChapterId) return false;

  // Ownership check
  if (resourceOwnerId && resourceOwnerId === member.id) return true;

  // Check permissions via roles -> rolePermissions
  const memberRoles = await db.memberRole.findMany({ where: { memberId: member.id } });
  if (!memberRoles || memberRoles.length === 0) return false;

  const roleIds = memberRoles.map((r) => r.roleId);
  const rolePermissions = await db.rolePermission.findMany({ where: { roleId: { in: roleIds } }, include: { permission: true } });

  const has = rolePermissions.some((rp) => rp.permission.action === permission);
  return has;
}
