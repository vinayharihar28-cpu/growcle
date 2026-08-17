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

export async function getRbacRoles(): Promise<RoleDefinition[]> {
  const roles = await db.role.findMany({
    include: { permissions: { include: { permission: true } }, _count: { select: { members: true } } },
    orderBy: { name: "asc" },
  });
  return roles.map(roleToDefinition);
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
  const role = await db.role.findUnique({ where: { name: roleCode } });
  if (!role) throw new Error("Role not found");
  await db.$transaction([
    db.memberRole.deleteMany({ where: { memberId } }),
    db.memberRole.create({ data: { memberId, roleId: role.id } }),
  ]);
  const member = await db.member.findUniqueOrThrow({ where: { id: memberId }, include: { chapter: { select: { name: true } } } });
  return { memberId, memberName: `${member.firstName} ${member.lastName}`, memberEmail: member.email, chapterName: member.chapter?.name ?? "Unassigned", roleCode: role.name, roleName: displayName(role.name), assignedAt: new Date().toISOString() };
}
