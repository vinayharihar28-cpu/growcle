import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export type NavigationConfig = NavSection[];
