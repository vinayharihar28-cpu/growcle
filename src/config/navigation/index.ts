import { WorkspaceType, WorkspaceConfig } from './types';
import { memberNavigationConfig } from './member';
import { adminNavigationConfig } from './admin';
import { superAdminNavigationConfig } from './super-admin';

export * from './types';

export const allWorkspaces: WorkspaceConfig[] = [
  memberNavigationConfig,
  adminNavigationConfig,
  superAdminNavigationConfig,
];

export function getWorkspaceConfig(workspace: WorkspaceType): WorkspaceConfig {
  switch (workspace) {
    case 'admin':
      return adminNavigationConfig;
    case 'super-admin':
      return superAdminNavigationConfig;
    case 'member':
    default:
      return memberNavigationConfig;
  }
}
