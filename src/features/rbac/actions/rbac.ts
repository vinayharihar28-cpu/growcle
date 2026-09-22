"use server";

import { db } from "@/shared/lib/db";
import type { PermissionItem, PermissionKey, RoleDefinition, UserRoleAssignment } from "@/types/rbac";

const displayName = (value: string) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function roleToDefinition(role: { id: string; name: string; description: string | null; permissions: { permission: { action: string } }[]; _count: { members: number } }): RoleDefinition {
  return {
    id: role.id,
    name: displayName(role.name),
    code: role.name,
    description: role.description ?? "No description provided.",
    scope: "GLOBAL",
    isCustom: false,
    memberCount: role._count.members,
    permissions: role.permissions.map(({ permission }) => permission.action),
  };
}

export const CANONICAL_CORE_ROLES = [
  { name: "ADMIN", description: "Full system administration, global chapters governance, financials, and configurations." },
  { name: "DIRECTOR", description: "Regional chapter oversight, assigning leadership teams, and performance monitoring." },
  { name: "LEADERSHIP_TEAM", description: "Chapter executive officers (President, VP, Secretary-Treasurer) managing weekly operations." },
  { name: "MEMBER", description: "Active chapter members passing referrals, participating in 1-to-1s, and closing business." },
] as const;

export const ALLOWED_ROLE_CODES = ["ADMIN", "DIRECTOR", "LEADERSHIP_TEAM", "MEMBER"] as const;

export async function getRbacRoles(): Promise<RoleDefinition[]> {
  for (const cr of CANONICAL_CORE_ROLES) {
    await db.role.upsert({
      where: { name: cr.name },
      create: { name: cr.name, description: cr.description },
      update: { description: cr.description },
    });
  }

  // Purge any legacy or non-core roles from database so only the 4 canonical roles ever exist
  await db.role.deleteMany({
    where: { name: { notIn: [...ALLOWED_ROLE_CODES] } },
  });

  const roles = await db.role.findMany({
    where: { name: { in: [...ALLOWED_ROLE_CODES] } },
    include: { permissions: { include: { permission: true } }, _count: { select: { members: true } } },
  });

  // Guarantee exact priority order: ADMIN -> DIRECTOR -> LEADERSHIP_TEAM -> MEMBER
  const sorted = roles.sort(
    (a, b) => ALLOWED_ROLE_CODES.indexOf(a.name as typeof ALLOWED_ROLE_CODES[number]) - ALLOWED_ROLE_CODES.indexOf(b.name as typeof ALLOWED_ROLE_CODES[number])
  );

  return sorted.map(roleToDefinition);
}

export async function getRbacPermissions(): Promise<PermissionItem[]> {
  const permissions = await db.permission.findMany({ orderBy: { action: "asc" } });
  return permissions.map((permission) => {
    const [category] = permission.action.split(".");
    return {
      key: permission.action,
      label: displayName(permission.action),
      description: permission.description ?? `Allows ${displayName(permission.action).toLowerCase()}.`,
      category: displayName(category) as PermissionItem["category"],
    };
  });
}

export async function updateRbacRolePermissions(roleCode: string, permissionKeys: PermissionKey[]): Promise<RoleDefinition> {
  const role = await db.role.findUnique({ where: { name: roleCode } });
  if (!role) throw new Error("Role not found");

  const permissions = await db.permission.findMany({ where: { action: { in: permissionKeys } }, select: { id: true } });
  await db.$transaction([
    db.rolePermission.deleteMany({ where: { roleId: role.id } }),
    db.rolePermission.createMany({ data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id })), skipDuplicates: true }),
  ]);

  const updated = await db.role.findUniqueOrThrow({
    where: { id: role.id },
    include: { permissions: { include: { permission: true } }, _count: { select: { members: true } } },
  });
  return roleToDefinition(updated);
}

export async function createRbacRole(data: Omit<RoleDefinition, "id" | "memberCount" | "isCustom">): Promise<RoleDefinition> {
  const roleName = data.code.trim().toLowerCase().replace(/_/g, "-");
  const permissionRecords = await db.permission.findMany({ where: { action: { in: data.permissions } }, select: { id: true } });
  const role = await db.role.create({
    data: {
      name: roleName,
      description: data.description || data.name,
      permissions: { create: permissionRecords.map((permission) => ({ permissionId: permission.id })) },
    },
    include: { permissions: { include: { permission: true } }, _count: { select: { members: true } } },
  });
  return roleToDefinition(role);
}

export async function getRbacAssignments(): Promise<UserRoleAssignment[]> {
  const assignments = await db.memberRole.findMany({
    where: { role: { name: { in: [...ALLOWED_ROLE_CODES] } } },
    include: { role: true, member: { include: { chapter: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return assignments.map((assignment) => ({
    memberId: assignment.memberId,
    memberName: `${assignment.member.firstName} ${assignment.member.lastName}`,
    memberEmail: assignment.member.email,
    chapterName: assignment.member.chapter?.name ?? "Unassigned",
    roleCode: assignment.role.name,
    roleName: displayName(assignment.role.name),
    assignedAt: assignment.createdAt.toISOString(),
  }));
}

export async function assignRbacRole(memberId: string, roleCode: string): Promise<UserRoleAssignment> {
  const targetMember = await db.member.findUniqueOrThrow({ where: { id: memberId } });
  if (targetMember.email.toLowerCase() === "vinayharihar28@gmail.com") {
    throw new Error("Action Prohibited: Vinay Harihar's Admin role is system-protected and cannot be changed or removed.");
  }
  if (!ALLOWED_ROLE_CODES.includes(roleCode as typeof ALLOWED_ROLE_CODES[number])) {
    throw new Error(`Invalid role code: ${roleCode}. Only the 4 core roles are supported.`);
  }
  const role = await db.role.findUnique({ where: { name: roleCode } });
  if (!role) throw new Error("Role not found");
  await db.$transaction([
    db.memberRole.deleteMany({ where: { memberId } }),
    db.memberRole.create({ data: { memberId, roleId: role.id } }),
  ]);
  const member = await db.member.findUniqueOrThrow({ where: { id: memberId }, include: { chapter: { select: { name: true } } } });
  return { memberId, memberName: `${member.firstName} ${member.lastName}`, memberEmail: member.email, chapterName: member.chapter?.name ?? "Unassigned", roleCode: role.name, roleName: displayName(role.name), assignedAt: new Date().toISOString() };
}
