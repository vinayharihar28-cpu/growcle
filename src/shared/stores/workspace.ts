import { create } from "zustand";

export type Role = "Member" | "Admin" | "Finance" | "SuperAdmin" | "Organization Administrator" | "Vice President" | "Secretary" | "Treasurer" | "Director";

interface WorkspaceState {
  activeRole: Role | null;
  availableRoles: Role[];
  setActiveRole: (role: Role) => void;
  setAvailableRoles: (roles: Role[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeRole: null,
  availableRoles: [],
  setActiveRole: (role) => set({ activeRole: role }),
  setAvailableRoles: (roles) => set({ availableRoles: roles }),
}));
