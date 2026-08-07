import { SettingsSection } from './types';

export const settingsSectionsConfig: SettingsSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'System preferences, locale, time zone, and application defaults.',
  },
  {
    id: 'profile',
    title: 'Business Profile',
    description: 'Update your personal bio, contact info, and business categories.',
  },
  {
    id: 'organization',
    title: 'Organization Config',
    description: 'Manage your local organization structure and details.',
    requiredPermission: 'chapters.manage',
  },
  {
    id: 'branding',
    title: 'Branding & Domain',
    description: 'White-label customizations: custom domain name, logo, and color system.',
    requiredPermission: 'system.branding',
  },
  {
    id: 'rbac',
    title: 'Roles & Permissions',
    description: 'Grant/revoke privileges, configure the permission matrix, and edit roles.',
    requiredPermission: 'rbac.roles_manage',
  },
];
