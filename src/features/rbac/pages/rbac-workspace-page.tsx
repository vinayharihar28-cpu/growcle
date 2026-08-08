'use client';

import { useState } from 'react';
import { useRbac } from '../hooks/use-rbac';
import { RolesGrid } from '../components/roles-grid';
import { PermissionsMatrixTable } from '../components/permissions-matrix-table';
import { UserRoleAssignmentTable } from '../components/user-role-assignment-table';
import { CreateRoleModal } from '../components/create-role-modal';
import { ShieldCheck, KeyRound, Users, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RbacWorkspacePage() {
  const { roles, permissions, assignments, togglePermissionForRole, createRole, assignRoleToUser } = useRbac();

  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'users'>('matrix');
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <KeyRound className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Role-Based Access Control (RBAC)</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise permissions matrix engine, system roles governance, and granular user privilege overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateRoleOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Create Custom Role
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b text-xs font-semibold space-x-6">
        <button
          onClick={() => setActiveTab('matrix')}
          className={cn(
            'pb-3 border-b-2 transition-colors flex items-center gap-1.5',
            activeTab === 'matrix' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Layers className="w-4 h-4" /> Permissions Matrix Grid
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={cn(
            'pb-3 border-b-2 transition-colors flex items-center gap-1.5',
            activeTab === 'roles' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <ShieldCheck className="w-4 h-4" /> System Roles Overview ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            'pb-3 border-b-2 transition-colors flex items-center gap-1.5',
            activeTab === 'users' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Users className="w-4 h-4" /> User Role Assignments ({assignments.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'matrix' && (
        <PermissionsMatrixTable roles={roles} permissions={permissions} onTogglePermission={togglePermissionForRole} />
      )}

      {activeTab === 'roles' && <RolesGrid roles={roles} onOpenCreateRole={() => setIsCreateRoleOpen(true)} />}

      {activeTab === 'users' && (
        <UserRoleAssignmentTable
          assignments={assignments}
          roles={roles}
          onAssignRole={assignRoleToUser}
        />
      )}

      {/* MODALS */}
      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        permissions={permissions}
        onClose={() => setIsCreateRoleOpen(false)}
        onSubmit={createRole}
      />
    </div>
  );
}
