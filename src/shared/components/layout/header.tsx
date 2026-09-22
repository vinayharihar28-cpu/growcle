"use client";

import * as React from "react";
import Link from "next/link";
import { useSidebarStore } from "@/shared/stores/sidebar";
import { Button } from "@/shared/components/ui/button";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Building2,
  Calendar,
  Users,
  Handshake,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Briefcase,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useRouter } from "next/navigation";
import { getChapterTheme } from "@/lib/chapter-themes";
import {
  getHeaderNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  createTestNotification,
  HeaderNotification,
} from "@/shared/actions/notification-actions";

export function Header() {
  const { toggle } = useSidebarStore();
  const { user, currentMember, logout } = useAuthStore();
  const {
    activeRole,
    availableRoles,
    setActiveRole,
    selectedChapterId,
    setSelectedChapterId,
    availableChapters,
    startRoleSwitch,
  } = useWorkspaceStore();
  const router = useRouter();

  const [notifications, setNotifications] = React.useState<HeaderNotification[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = React.useState(false);

  // Load real notifications on mount
  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await getHeaderNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead();
  };

  const handleNotificationClick = async (notif: HeaderNotification) => {
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      await markNotificationAsRead(notif.id);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    await clearAllNotifications();
  };

  const handleSendTestAlert = async () => {
    setIsLoadingNotifs(true);
    await createTestNotification();
    await fetchNotifications();
    setIsLoadingNotifs(false);
  };

  const handleRoleChange = (val: Role) => {
    if (val === activeRole) return;
    setActiveRole(val);
    if (typeof document !== "undefined") {
      document.cookie = `active-role=${encodeURIComponent(val)}; path=/; max-age=31536000; SameSite=Lax`;
    }
    if (val === "Admin") {
      router.push("/dashboard/admin");
    } else if (val === "Director") {
      router.push("/dashboard/director");
    } else if (val === "Leadership Team") {
      router.push("/dashboard/leadership");
    } else {
      router.push("/dashboard/member");
    }
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    if (typeof document !== "undefined") {
      document.cookie = `active-chapter-id=${chapterId}; path=/; max-age=31536000; SameSite=Lax`;
    }
    router.refresh();
  };

  const handleLogout = async () => {
    try {
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "VISITOR":
        return Users;
      case "MEETING":
        return Calendar;
      case "REFERRAL":
        return Handshake;
      case "CHAPTER":
        return Building2;
      default:
        return Sparkles;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-3 border-b bg-background px-4 shadow-xs sm:gap-x-4 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" onClick={toggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-3 sm:gap-x-4 self-stretch items-center justify-between">
        {/* Left: Chapter Selector or Active Chapter Badge */}
        <div className="flex items-center gap-2">
          {/* Chapter Selector for Admin and Director */}
          {(activeRole === "Admin" || activeRole === "Director") && availableChapters.length > 0 && (
            <div className="flex items-center">
              <Select
                value={selectedChapterId || "all"}
                onValueChange={(val: any) => {
                  if (val) handleChapterChange(val);
                }}
              >
                <SelectTrigger
                  id="header-chapter-selector"
                  className="h-9 px-3 w-auto min-w-[170px] sm:min-w-[240px] md:min-w-[280px] max-w-[250px] sm:max-w-xs md:max-w-sm bg-muted/40 border-border/80 text-xs sm:text-sm font-medium transition-all"
                >
                  <SelectValue placeholder="All Chapters">
                    {(() => {
                      const activeChap = availableChapters.find((c) => c.id === selectedChapterId);
                      if (activeChap) {
                        const theme = getChapterTheme(activeChap.themeColor);
                        return (
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-background shadow-xs"
                              style={{ backgroundColor: theme.hex }}
                            />
                            <span className="truncate font-semibold text-foreground">
                              {activeChap.name} {activeChap.chapterCode ? `(${activeChap.chapterCode})` : ""}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2 truncate">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className="font-semibold text-primary truncate">
                            All Chapters (Platform Aggregate)
                          </span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="font-semibold text-primary">All Chapters (Platform Aggregate)</span>
                    </div>
                  </SelectItem>
                  {availableChapters.map((chap) => {
                    const chapTheme = getChapterTheme(chap.themeColor);
                    return (
                      <SelectItem key={chap.id} value={chap.id}>
                        <div className="flex items-center gap-2 w-full">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: chapTheme.hex }}
                          />
                          <span className="truncate font-medium">
                            {chap.name} {chap.chapterCode ? `(${chap.chapterCode})` : ""}
                          </span>
                          <span
                            className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline-block"
                            style={{
                              backgroundColor: `${chapTheme.hex}20`,
                              color: chapTheme.hex,
                            }}
                          >
                            {chapTheme.name}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Chapter Display Badge for Leadership Team and Member */}
          {activeRole !== "Admin" && activeRole !== "Director" && (
            (() => {
              const activeChap =
                availableChapters.find((c) => c.id === (currentMember?.chapterId || selectedChapterId)) ||
                availableChapters[0];
              if (!activeChap) return null;
              const chapTheme = getChapterTheme(activeChap.themeColor);
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/80 text-xs sm:text-sm font-medium shadow-2xs">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-background shadow-xs"
                    style={{ backgroundColor: chapTheme.hex }}
                  />
                  <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[240px]">
                    {activeChap.name}
                  </span>
                  {activeChap.chapterCode && (
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      ({activeChap.chapterCode})
                    </span>
                  )}
                </div>
              );
            })()
          )}
        </div>

        {/* Right: Role Switcher, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-x-1.5 sm:gap-x-2.5">
          {/* Role Switcher */}
          <Select value={activeRole ?? undefined} onValueChange={(val: any) => handleRoleChange(val as Role)}>
            <SelectTrigger className="w-[110px] xs:w-[130px] sm:w-[160px] text-xs sm:text-sm h-9 bg-muted/40 hover:bg-muted/70 border-border/80 rounded-xl font-medium">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[150px]">
              {availableRoles.map((role: string) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ThemeToggle />

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger
              id="header-notifications-trigger"
              className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center justify-center cursor-pointer transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm sm:w-96 p-0 shadow-xl border" align="end">
              <div className="flex items-center justify-between p-3.5 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 ? (
                    <span className="bg-primary/15 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs font-normal">All caught up</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoadingNotifs}
                    onClick={handleSendTestAlert}
                    className="text-xs h-7 px-2 text-primary hover:text-primary/80"
                    title="Generate test notification"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Test
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="divide-y max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                    <p className="text-xs font-medium text-foreground">No notifications</p>
                    <p className="text-[11px] text-muted-foreground">
                      New alerts and updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const IconComponent = getNotificationIcon(n.type);
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-muted/60 cursor-pointer ${
                          !n.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            !n.isRead ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className={`text-xs font-semibold leading-tight truncate ${
                                !n.isRead ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{n.timeAgo}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                        </div>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5 ring-2 ring-background" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Popover Footer */}
              {notifications.length > 0 && (
                <div className="p-2.5 border-t bg-muted/20 flex items-center justify-between text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-[11px] h-7 px-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Clear all
                  </Button>
                  <span className="text-[10px] text-muted-foreground">
                    {notifications.length} total alerts
                  </span>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* User Profile Card & Menu Popover */}
          <Popover>
            <PopoverTrigger
              id="header-user-menu-trigger"
              className="relative h-9 w-9 rounded-full inline-flex items-center justify-center p-0.5 hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer outline-hidden"
              aria-label="User account menu"
            >
              <Avatar className="h-8 w-8 rounded-full border border-border">
                <AvatarImage
                  src={user?.image || currentMember?.profileImage || undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 shadow-xl border bg-card rounded-xl overflow-hidden" align="end">
              <div className="p-3.5 bg-muted/40 border-b space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold leading-none text-foreground truncate">
                    {user?.name || "User Account"}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary shrink-0">
                    {activeRole}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
                {currentMember?.membershipNumber && (
                  <p className="text-[10px] font-mono text-muted-foreground">
                    ID: {currentMember.membershipNumber}
                  </p>
                )}
              </div>

              <div className="p-1.5 space-y-0.5">
                <Link
                  href="/dashboard/member/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/dashboard/member/business"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Business Portfolio</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="p-1.5 border-t bg-muted/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span>Log out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
