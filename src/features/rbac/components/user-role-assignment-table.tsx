'use client';

import { RoleDefinition, UserRoleAssignment } from '@/types/rbac';

interface UserRoleAssignmentTableProps {
  assignments: UserRoleAssignment[];
  roles: RoleDefinition[];
  onAssignRole: (memberId: string, roleCode: string) => void;
}

export function UserRoleAssignmentTable({
  assignments,
  roles,
  onAssignRole,
}: UserRoleAssignmentTableProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-base text-foreground">User Role Assignments & Individual Overrides</h3>
        <p className="text-xs text-muted-foreground">
          Assign backend-managed roles to members. Individual permission overrides will appear here when their backend endpoint is available.
        </p>
      </div>

      <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/60 border-b text-[11px] font-bold text-muted-foreground uppercase">
            <tr>
              <th className="p-3.5">User / Member</th>
              <th className="p-3.5">Chapter</th>
              <th className="p-3.5">Current Role</th>
              <th className="p-3.5">Assigned Date</th>
              <th className="p-3.5 text-right">Role Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assignments.map((asgn) => (
              <tr key={asgn.memberId} className="hover:bg-accent/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-xs">
                      {asgn.memberName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{asgn.memberName}</div>
                      <div className="text-[11px] text-muted-foreground">{asgn.memberEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-muted-foreground font-medium">{asgn.chapterName}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                    {asgn.roleName}
                  </span>
                </td>
                <td className="p-3.5 text-muted-foreground text-[11px]">{asgn.assignedAt}</td>
                <td className="p-3.5 text-right">
                  <select
                    value={asgn.roleCode}
                    onChange={(e) => onAssignRole(asgn.memberId, e.target.value)}
                    className="px-2.5 py-1 rounded-lg border text-xs bg-background font-medium outline-hidden cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
