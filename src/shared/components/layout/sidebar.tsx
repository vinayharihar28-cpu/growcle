"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/shared/stores/sidebar";
import { useWorkspaceStore } from "@/shared/stores/workspace";
import { useAuthStore } from "@/shared/stores/auth";
import { getNavigationForRole } from "@/shared/config/navigation";
import { GrowcleLogo } from "@/shared/components/brand/growcle-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { X, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarStore();
  const { activeRole, setActiveRole, availableRoles } = useWorkspaceStore();
  const { user, currentMember, logout } = useAuthStore();

  const navigation = getNavigationForRole(activeRole);

  const handleLogout = async () => {
    try {
      const { authClient } = await import("@/lib/auth-client");
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error", err);
    } finally {
      logout();
      if (typeof document !== "undefined") {
        document.cookie = "active-chapter-id=; path=/; max-age=0";
        document.cookie = "better-auth.session_token=; path=/; max-age=0";
      }
      window.location.href = "/login";
    }
  };

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
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b">
          <Link 
            href={
              activeRole === "Admin" || activeRole === "Director"
                ? "/dashboard/admin"
                : activeRole === "Leadership Team"
                ? "/dashboard/leadership"
                : "/dashboard/member"
            } 
            className="flex items-center group"
          >
            <GrowcleLogo size={32} textColor="text-primary font-bold text-lg" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto nav-scrollbar p-4 space-y-6">
          {navigation.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isRootDashboard =
                    item.href === "/dashboard/leadership" ||
                    item.href === "/dashboard/director" ||
                    item.href === "/dashboard/member" ||
                    item.href === "/dashboard/admin" ||
                    item.href === "/dashboard";
                  const isActive = isRootDashboard
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
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

        {/* Mobile Only: Role Switcher & User Card Drawer Footer */}
        <div className="p-3 border-t bg-sidebar-accent/20 lg:hidden space-y-2.5">
          {/* Mobile Role Switcher */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 mb-1 block">
              Active Role Workspace
            </label>
            <select
              value={activeRole ?? undefined}
              onChange={(e) => {
                const val = e.target.value as any;
                setActiveRole(val);
                if (typeof document !== "undefined") {
                  document.cookie = `active-role=${encodeURIComponent(val)}; path=/; max-age=31536000; SameSite=Lax`;
                }
                setIsOpen(false);
                if (val === "Admin" || val === "Director") window.location.href = "/dashboard/admin";
                else if (val === "Leadership Team") window.location.href = "/dashboard/leadership";
                else window.location.href = "/dashboard/member";
              }}
              className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary"
            >
              {availableRoles.map((role: string) => (
                <option key={role} value={role}>
                  {role === "Admin" || role === "Director" ? "Admin / Director" : role}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile & Logout Bottom Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 shadow-xs">
            <Link
              href="/dashboard/member/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              title="View Profile"
            >
              <Avatar className="h-8 w-8 rounded-full border border-border shrink-0">
                <AvatarImage
                  src={user?.image || currentMember?.profileImage || undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate leading-tight">
                  {user?.name || `${currentMember?.firstName || 'Active'} ${currentMember?.lastName || 'Member'}`}
                </p>
                <div className="flex items-center gap-1">
                  <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/15 text-primary">
                    {activeRole}
                  </span>
                  {currentMember?.membershipNumber && (
                    <span className="text-[9px] text-muted-foreground truncate">
                      {currentMember.membershipNumber}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 ml-1.5"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
