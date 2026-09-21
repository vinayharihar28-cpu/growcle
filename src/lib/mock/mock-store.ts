import { AdminMember, AdminMeeting, AttendanceRecord, ChapterDetails, AdminStats, AdminDirector, LeadershipAssignment } from '@/types/admin';
import { RoleDefinition, PermissionItem, UserRoleAssignment, PermissionOverride } from '@/types/rbac';

export const ALL_PERMISSIONS: PermissionItem[] = [
  // Members Category
  { key: 'members.view', label: 'View Members', description: 'View directory and member profile information', category: 'Members' },
  { key: 'members.create', label: 'Create & Invite Members', description: 'Add or invite new members to the chapter', category: 'Members' },
  { key: 'members.edit', label: 'Edit Member Profiles', description: 'Update contact details, business info, and statuses', category: 'Members' },
  { key: 'members.delete', label: 'Delete / Suspend Members', description: 'Remove or suspend member access', category: 'Members' },

  // Meetings Category
  { key: 'meetings.view', label: 'View Meetings', description: 'Access meeting schedules and past history', category: 'Meetings' },
  { key: 'meetings.create', label: 'Schedule Meetings', description: 'Create weekly or special chapter meetings', category: 'Meetings' },
  { key: 'meetings.edit', label: 'Edit & Cancel Meetings', description: 'Update agendas, locations, or cancel meetings', category: 'Meetings' },
  { key: 'meetings.attendance', label: 'Manage Attendance', description: 'Record and update attendance sheets', category: 'Meetings' },

  // Chapters Category
  { key: 'chapters.view', label: 'View Chapters', description: 'Browse chapter directory and information', category: 'Chapters' },
  { key: 'chapters.manage', label: 'Manage Chapters', description: 'Configure officer roles and meeting rules', category: 'Chapters' },

  // RBAC Category
  { key: 'rbac.roles_manage', label: 'Manage Roles & Matrix', description: 'Create custom roles and edit permissions matrix', category: 'RBAC & Access' },
  { key: 'rbac.assign', label: 'Assign Roles to Users', description: 'Change member roles and set custom overrides', category: 'RBAC & Access' },

  // Finance & System
  { key: 'finance.view', label: 'View Finance & Invoices', description: 'View dues, payments, and financial logs', category: 'Finance' },
  { key: 'finance.manage', label: 'Manage Dues & Invoices', description: 'Process invoices and record payments', category: 'Finance' },
  { key: 'reports.view', label: 'View Analytics & Reports', description: 'Generate performance and growth reports', category: 'System' },
  { key: 'system.branding', label: 'Manage White-Label Branding', description: 'Configure custom domains, logos, and themes', category: 'System' },
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    code: 'SUPER_ADMIN',
    description: 'Unrestricted global access across all tenants, white-label configs, and organizations',
    scope: 'GLOBAL',
    isCustom: false,
    memberCount: 2,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
  },
  {
    id: 'role-org-admin',
    name: 'Organization Admin',
    code: 'ORG_ADMIN',
    description: 'Full management over chapter members, meetings, attendance, and role assignments',
    scope: 'ORGANIZATION',
    isCustom: false,
    memberCount: 8,
    permissions: [
      'members.view',
      'members.create',
      'members.edit',
      'members.delete',
      'meetings.view',
      'meetings.create',
      'meetings.edit',
      'meetings.attendance',
      'chapters.view',
      'chapters.manage',
      'rbac.roles_manage',
      'rbac.assign',
      'reports.view',
      'system.branding',
    ],
  },
  {
    id: 'role-chapter-president',
    name: 'Chapter President',
    code: 'CHAPTER_PRESIDENT',
    description: 'Leads weekly meetings, oversees chapter growth, and manages member applications',
    scope: 'CHAPTER',
    isCustom: false,
    memberCount: 14,
    permissions: [
      'members.view',
      'members.create',
      'members.edit',
      'meetings.view',
      'meetings.create',
      'meetings.edit',
      'meetings.attendance',
      'chapters.view',
      'reports.view',
    ],
  },
  {
    id: 'role-vice-president',
    name: 'Vice President',
    code: 'VICE_PRESIDENT',
    description: 'Oversees meeting attendance tracking, membership committee, and performance reports',
    scope: 'CHAPTER',
    isCustom: false,
    memberCount: 14,
    permissions: [
      'members.view',
      'meetings.view',
      'meetings.attendance',
      'chapters.view',
      'reports.view',
    ],
  },
  {
    id: 'role-secretary',
    name: 'Secretary / Treasurer',
    code: 'SECRETARY_TREASURER',
    description: 'Manages member dues, renewal invoices, and records official meeting notes',
    scope: 'CHAPTER',
    isCustom: false,
    memberCount: 14,
    permissions: [
      'members.view',
      'meetings.view',
      'finance.view',
      'finance.manage',
    ],
  },
  {
    id: 'role-member',
    name: 'Chapter Member',
    code: 'MEMBER',
    description: 'Active chapter participant who passes referrals, logs 1-on-1s, and attends weekly meetings',
    scope: 'CHAPTER',
    isCustom: false,
    memberCount: 240,
    permissions: ['members.view', 'meetings.view'],
  },
  {
    id: 'role-visitor',
    name: 'Visitor / Guest',
    code: 'VISITOR',
    description: 'Guest exploring chapter membership with restricted access to basic directory information',
    scope: 'CHAPTER',
    isCustom: false,
    memberCount: 45,
    permissions: ['members.view'],
  },
];

export const MOCK_MEMBERS: AdminMember[] = [];

export const MOCK_MEETINGS: AdminMeeting[] = [];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];

export const MOCK_CHAPTERS: ChapterDetails[] = [];

export const MOCK_STATS: AdminStats = {
  chapters: {
    total: 0,
    active: 0,
    inactive: 0,
  },
  members: {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  },
  visitors: {
    total: 0,
    upcoming: 0,
    attended: 0,
    converted: 0,
  },
  referrals: {
    total: 0,
    pending: 0,
    contacted: 0,
    closedWon: 0,
    closedLost: 0,
    totalClosedBusiness: 0,
  },
  payments: {
    totalCollected: 0,
    pending: 0,
    outstanding: 0,
  },
};

export const MOCK_USER_ASSIGNMENTS: UserRoleAssignment[] = [];

export const MOCK_PERMISSIONS_OVERRIDE: Record<string, PermissionOverride> = {};

export const MOCK_DIRECTORS: AdminDirector[] = [];

export const MOCK_LEADERSHIP: LeadershipAssignment[] = [];
