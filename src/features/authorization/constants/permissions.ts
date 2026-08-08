/**
 * System-wide Permission Registry.
 * Follows a standard `resource.action` convention.
 * 
 * NOTE: These string values must exactly match the `slug` field 
 * of the Permission records in the database.
 */
export const PERMISSIONS = {
  // Organization Resource
  ORG: {
    CREATE: "organization.create",
    UPDATE: "organization.update",
    DELETE: "organization.delete",
    VIEW: "organization.view",
  },
  
  // Chapter Resource
  CHAPTER: {
    CREATE: "chapter.create",
    UPDATE: "chapter.update",
    DELETE: "chapter.delete", // Adding delete for completeness
    VIEW: "chapter.view", // Adding view for completeness
  },
  
  // Member Resource
  MEMBER: {
    CREATE: "member.create",
    INVITE: "member.invite",
    UPDATE: "member.update",
    DELETE: "member.delete",
    VIEW: "member.view",
  },
  
  // Meeting Resource
  MEETING: {
    CREATE: "meeting.create",
    UPDATE: "meeting.update",
    DELETE: "meeting.delete",
    VIEW: "meeting.view",
  },

  // Attendance Resource
  ATTENDANCE: {
    MANAGE: "attendance.manage",
    VIEW: "attendance.view",
  },
  
  // Referral Resource
  REFERRAL: {
    CREATE: "referral.create",
    UPDATE: "referral.update",
    VIEW: "referral.view",
  },
  
  // Finance Resource
  FINANCE: {
    MANAGE: "finance.manage",
    VIEW: "finance.view",
  },
  
  // Notification Resource
  NOTIFICATION: {
    SEND: "notification.send",
  },
  
  // Global & Reporting
  REPORT: {
    VIEW: "report.view",
  },
  AUDIT: {
    VIEW: "audit.view",
  }
} as const;

// Flatten permissions for easy extraction
export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((resource) => Object.values(resource));
