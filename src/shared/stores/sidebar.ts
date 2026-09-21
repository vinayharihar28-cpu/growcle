import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set: any) => ({
  isOpen: true,
  toggle: () => set((state: any) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
