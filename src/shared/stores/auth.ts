import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface MemberInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  chapterId?: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  currentMember: MemberInfo | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCurrentMember: (member: MemberInfo | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr-101",
    name: "Alexandra Chen",
    email: "alexandra.chen@apextechnologies.io",
    roles: ["ORG_ADMIN"],
  },
  currentMember: {
    id: "mem-101",
    firstName: "Alexandra",
    lastName: "Chen",
    email: "alexandra.chen@apextechnologies.io",
    chapterId: "chap-01",
    organizationId: "org-01",
  },
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, currentMember: null, isAuthenticated: false }),
  setCurrentMember: (currentMember) => set({ currentMember }),
}));
