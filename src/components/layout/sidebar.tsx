"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  BarChart2, 
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Members", href: "/members", icon: Users },
  { title: "Visitors", href: "/visitors", icon: UserPlus },
  { title: "Meetings", href: "/meetings", icon: Calendar },
  { title: "Reports", href: "/reports", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1e1e1e] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Growcle</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Member Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
