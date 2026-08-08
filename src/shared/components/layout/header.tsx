"use client";

import { useSidebarStore } from "@/shared/stores/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/shared/stores/auth";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export function Header() {
  const { toggle } = useSidebarStore();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" onClick={toggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
