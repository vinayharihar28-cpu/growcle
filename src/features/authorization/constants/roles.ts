/**
 * Standard System Roles.
 * 
 * NOTE: These string values must exactly match the `slug` field 
 * of the Role records in the database.
 */
export const ROLES = {
  PLATFORM_ADMIN: "platform-admin",
  ORGANIZATION_ADMIN: "organization-admin",
  CHAPTER_ADMIN: "chapter-admin",
  CHAPTER_OFFICER: "chapter-officer",
  MEMBER: "member",
} as const;

export type RoleSlug = typeof ROLES[keyof typeof ROLES];
