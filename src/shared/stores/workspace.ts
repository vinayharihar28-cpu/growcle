import { create } from "zustand";

export type Role = "Admin" | "Director" | "Leadership Team" | "Membership" | "Finance" | "SuperAdmin" | "Organization Administrator" | "Vice President" | "Secretary" | "Treasurer" | "Member";

interface WorkspaceState {
  activeRole: Role | null;
  availableRoles: Role[];
  setActiveRole: (role: Role) => void;
  setAvailableRoles: (roles: Role[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeRole: "Membership",
  availableRoles: ["Admin", "Director", "Leadership Team", "Membership"],
  setActiveRole: (role) => set({ activeRole: role }),
  setAvailableRoles: (roles) => set({ availableRoles: roles }),
}));
