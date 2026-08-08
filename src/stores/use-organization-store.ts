'use client';

import { create } from 'zustand';

export interface OrganizationInfo {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string; // Hex color code for white-label styling
  customDomain?: string;
}

export const MOCK_ORGANIZATIONS: OrganizationInfo[] = [
  {
    id: 'org-01',
    name: 'Growcle Business Network',
    primaryColor: '#4f46e5', // Indigo-600
  },
  {
    id: 'org-02',
    name: 'ABC Business Network',
    primaryColor: '#0ea5e9', // Sky-500
  },
  {
    id: 'org-03',
    name: 'XYZ Chamber of Commerce',
    primaryColor: '#10b981', // Emerald-500
  },
];

interface OrganizationState {
  activeOrganization: OrganizationInfo;
  setActiveOrganization: (orgId: string) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  activeOrganization: MOCK_ORGANIZATIONS[0],
  setActiveOrganization: (orgId) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId) || MOCK_ORGANIZATIONS[0];
    set({ activeOrganization: org });

    // Dynamic brand color injection: inject a CSS custom property into document body
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand-primary', org.primaryColor);
    }
  },
}));
