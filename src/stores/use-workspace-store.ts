'use client';

import { create } from 'zustand';
import { WorkspaceType, WorkspaceConfig, getWorkspaceConfig } from '@/config/navigation';

interface WorkspaceState {
  activeWorkspace: WorkspaceType;
  workspaceConfig: WorkspaceConfig;
  setActiveWorkspace: (workspace: WorkspaceType) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: 'admin',
  workspaceConfig: getWorkspaceConfig('admin'),
  setActiveWorkspace: (workspace: WorkspaceType) =>
    set({
      activeWorkspace: workspace,
      workspaceConfig: getWorkspaceConfig(workspace),
    }),
}));
