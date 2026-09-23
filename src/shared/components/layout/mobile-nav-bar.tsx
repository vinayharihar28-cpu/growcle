"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore, Role } from "@/shared/stores/workspace";
import { useSidebarStore } from "@/shared/stores/sidebar";
import {
  Home,
  Handshake,
  CalendarCheck,
  Users,
  Menu,
  CreditCard,
  Building2,
  Shield,
  User,
  Check,
  X,
  Repeat,
} from "lucide-react";

export function MobileNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, availableRoles, setActiveRole } = useWorkspaceStore();
  const { toggle } = useSidebarStore();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Define tab items based on active workspace
  const getNavItems = () => {
    if (activeRole === "Admin" || activeRole === "Director") {
      return [
        { label: "Overview", href: "/dashboard/director", icon: Home },
        { label: "Chapters", href: "/dashboard/director/chapters", icon: Building2 },
        { label: "Treasury", href: "/dashboard/director/payments", icon: CreditCard },
      ];
    } else if (activeRole === "Leadership Team") {
      return [
        { label: "Dashboard", href: "/dashboard/leadership", icon: Home },
        { label: "Attendance", href: "/dashboard/leadership/attendance", icon: CalendarCheck },
        { label: "Meetings", href: "/dashboard/leadership/meetings", icon: Users },
      ];
    } else {
      // Member default
      return [
        { label: "Home", href: "/dashboard/member", icon: Home },
        { label: "Referrals", href: "/dashboard/member/referrals", icon: Handshake },
        { label: "Directory", href: "/dashboard/member/directory", icon: Users },
      ];
    }
  };

  const items = getNavItems();

  const handleSelectRole = (newRole: Role) => {
    if (newRole !== activeRole) {
      setActiveRole(newRole);
      if (typeof document !== "undefined") {
        document.cookie = `active-role=${encodeURIComponent(newRole)}; path=/; max-age=31536000; SameSite=Lax`;
      }
      if (newRole === "Admin" || newRole === "Director") {
        router.push("/dashboard/director");
      } else if (newRole === "Leadership Team") {
        router.push("/dashboard/leadership");
      } else {
        router.push("/dashboard/member");
      }
    }
    setIsRoleModalOpen(false);
  };

  const allRolesList = [
    {
      id: "Member",
      name: "Member Workspace",
      badge: "Member",
      description: "Referrals, 1-to-1 synergies, visitor invites & directory",
      icon: User,
    },
    {
      id: "Leadership Team",
      name: "Leadership Team Workspace",
      badge: "Leadership",
      description: "Live meeting attendance & fee collection",
      icon: Users,
    },
    {
      id: "Admin",
      name: "Admin / Director Workspace",
      badge: "Admin",
      description: "Chapter governance, treasury & platform settings",
      icon: Shield,
    },
  ];

  const filteredRoles = allRolesList.filter(
    (r) =>
      availableRoles.includes(r.id as Role) ||
      (r.id === "Admin" && (availableRoles.includes("Admin") || availableRoles.includes("Director")))
  );

  const displayRoles = filteredRoles.length > 0 ? filteredRoles : allRolesList;

  const getActiveRoleBadge = () => {
    if (activeRole === "Leadership Team") return "LT Role";
    if (activeRole === "Admin" || activeRole === "Director") return "Admin Role";
    return "Member Role";
  };

  return (
    <>
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-2 py-1 shadow-lg flex items-center justify-around h-16 safe-bottom">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard/member" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Switch Role Tab Button */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-primary hover:text-primary/80 transition-all cursor-pointer"
          aria-label="Switch workspace role"
        >
          <div className="p-1 rounded-lg bg-primary/10 relative">
            <Repeat className="h-5 w-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5 text-primary">
            {getActiveRoleBadge()}
          </span>
        </button>

        {/* Menu / Drawer Toggle */}
        <button
          onClick={toggle}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <div className="p-1 rounded-lg">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </nav>

      {/* Role Switcher Bottom Sheet Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Repeat className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Switch Workspace Role</h3>
                  <p className="text-xs text-muted-foreground">Select your active role on mobile</p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {displayRoles.map((role) => {
                const isSelected =
                  activeRole === role.id ||
                  (role.id === "Admin" && (activeRole === "Admin" || activeRole === "Director"));
                const RoleIcon = role.icon;

                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role.id as Role)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/30"
                        : "bg-muted/30 border-border hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <RoleIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{role.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
