"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { useWorkspaceStore, Role } from "@/shared/stores/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function WorkspaceSwitcher() {
  const { activeRole, availableRoles, setActiveRole } = useWorkspaceStore();

  if (!activeRole) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {activeRole}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0">
        <DropdownMenuLabel className="px-3 py-2 text-xs text-muted-foreground">
          Available Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onSelect={() => setActiveRole(role)}
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
          >
            <span>{role}</span>
            {activeRole === role && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
