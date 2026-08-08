"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/shared/stores/sidebar";
import { useWorkspaceStore } from "@/shared/stores/workspace";
import { getNavigationForRole } from "@/shared/config/navigation";
import { WorkspaceSwitcher } from "../workspace-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const { activeRole } = useWorkspaceStore();

  const navigation = getNavigationForRole(activeRole);

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <span className="text-xl font-bold tracking-tight text-primary">
          Growcle
        </span>
      </div>
      
      <div className="p-4 border-b">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
