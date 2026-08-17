"use client";

import * as React from "react";
import { useSidebarStore } from "@/shared/stores/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Menu, Bell, User, Settings, LogOut, CheckCircle2, Clock, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/shared/stores/auth";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { useWorkspaceStore, Role } from "@/shared/stores/workspace";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useRouter } from "next/navigation";

export function Header() {
  const { toggle } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const { activeRole, availableRoles, setActiveRole } = useWorkspaceStore();
  const router = useRouter();

  const [notifications, setNotifications] = React.useState([
    {
      id: "1",
      title: "New Member Registration",
      message: "Sarah Jenkins submitted a membership request for Silicon Valley Chapter.",
      time: "10m ago",
      read: false,
      icon: User,
    },
    {
      id: "2",
      title: "Referral Closed Business",
      message: "$12,500 closed business logged by Marcus Vance.",
      time: "1h ago",
      read: false,
      icon: CheckCircle2,
    },
    {
      id: "3",
      title: "Upcoming 1-to-1 Meeting",
      message: "Scheduled meeting tomorrow at 10:00 AM with Tech Leaders Chapter.",
      time: "3h ago",
      read: true,
      icon: Clock,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            logout();
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out error", err);
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" onClick={toggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Select value={activeRole ?? undefined} onValueChange={(val) => setActiveRole(val as Role)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ThemeToggle />

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-500/10 text-indigo-500 text-xs px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto p-0 text-muted-foreground hover:text-foreground">
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="divide-y max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const NotificationIcon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                        !n.read ? "bg-indigo-500/5" : ""
                      }`}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                        )
                      }
                    >
                      <div className="p-2 rounded-lg bg-muted shrink-0 text-foreground">
                        <NotificationIcon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-semibold leading-none">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground pt-1">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-indigo-600 text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User Account"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/members")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
