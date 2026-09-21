import { create } from "zustand";

export type Role =
  | "Admin"
  | "Director"
  | "Leadership Team"
  | "President"
  | "Vice President"
  | "Secretary"
  | "Treasurer"
  | "Membership"
  | "Finance"
  | "SuperAdmin"
  | "Organization Administrator"
  | "Member";

export interface ChapterOption {
  id: string;
  name: string;
  chapterCode?: string | null;
  themeColor?: string | null;
}

interface WorkspaceState {
  activeRole: Role | null;
  availableRoles: Role[];
  selectedChapterId: string;
  availableChapters: ChapterOption[];
  isSwitchingRole: boolean;
  switchingTargetRole: Role | null;
  setActiveRole: (role: Role) => void;
  setAvailableRoles: (roles: Role[]) => void;
  setSelectedChapterId: (chapterId: string) => void;
  setAvailableChapters: (chapters: ChapterOption[]) => void;
  startRoleSwitch: (targetRole: Role) => void;
  finishRoleSwitch: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set: any) => ({
  activeRole: "Member",
  availableRoles: ["Member"],
  selectedChapterId: "all",
  availableChapters: [],
  isSwitchingRole: false,
  switchingTargetRole: null,
  setActiveRole: (role: Role) => set({ activeRole: role }),
  setAvailableRoles: (roles: Role[]) => set({ availableRoles: roles }),
  setSelectedChapterId: (chapterId: string) => set({ selectedChapterId: chapterId }),
  setAvailableChapters: (chapters: ChapterOption[]) => set({ availableChapters: chapters }),
  startRoleSwitch: (targetRole: Role) =>
    set({ isSwitchingRole: true, switchingTargetRole: targetRole }),
  finishRoleSwitch: () =>
    set({ isSwitchingRole: false, switchingTargetRole: null }),
}));
