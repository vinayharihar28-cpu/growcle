import { WorkspaceType, WorkspaceConfig } from './types';
import { memberNavigationConfig } from './member';
import { chapterAdminNavigationConfig } from './chapter-admin';
import { organizationAdminNavigationConfig } from './organization-admin';
import { financeNavigationConfig } from './finance';
import { platformAdminNavigationConfig } from './platform-admin';
import { directorNavigationConfig } from './director';

export * from './types';
export * from './settings';

export const allWorkspaces: WorkspaceConfig[] = [
  memberNavigationConfig,
  chapterAdminNavigationConfig,
  organizationAdminNavigationConfig,
  financeNavigationConfig,
  platformAdminNavigationConfig,
  directorNavigationConfig,
];

export function getWorkspaceConfig(workspace: WorkspaceType): WorkspaceConfig {
  switch (workspace) {
    case 'director':
      return directorNavigationConfig;
    case 'chapter-admin':
      return chapterAdminNavigationConfig;
    case 'organization-admin':
      return organizationAdminNavigationConfig;
    case 'finance':
      return financeNavigationConfig;
    case 'platform-admin':
      return platformAdminNavigationConfig;
    case 'member':
    default:
      return memberNavigationConfig;
  }
}
