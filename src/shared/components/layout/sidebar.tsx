"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/shared/stores/sidebar";
import { useWorkspaceStore } from "@/shared/stores/workspace";
import { getNavigationForRole } from "@/shared/config/navigation";
import { X } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarStore();
  const { activeRole } = useWorkspaceStore();

  const navigation = getNavigationForRole(activeRole);

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              Growcle
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
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
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          // Auto close drawer on small screens when user clicks a link
                          if (window.innerWidth < 1024) {
                            setIsOpen(false);
                          }
                        }}
                        className={cn(
                          "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground"
                        )}
                      >
                        <Icon className="mr-3 h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

