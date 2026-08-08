'use client';

import { useState } from 'react';
import { useRbac } from '@/features/rbac/hooks/use-rbac';
import { RolesGrid } from '@/features/rbac/components/roles-grid';
import { PermissionsMatrixTable } from '@/features/rbac/components/permissions-matrix-table';
import { UserRoleAssignmentTable } from '@/features/rbac/components/user-role-assignment-table';
import { CreateRoleModal } from '@/features/rbac/components/create-role-modal';
import { settingsSectionsConfig } from '@/config/navigation/settings';
import { usePermissions } from '@/lib/permissions/use-permissions';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Settings,
  User,
  Building,
  Palette,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  FileCheck,
  Globe,
  Sliders,
} from 'lucide-react';

export default function SettingsPage() {
  const { can } = usePermissions();
  const {
    roles,
    permissions,
    assignments,
    loading,
    togglePermissionForRole,
    createRole,
    assignRoleToUser,
  } = useRbac();

  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Settings mock profile state
  const [profileData, setProfileData] = useState({
    name: 'Alexandra Chen',
    email: 'alexandra.chen@apextechnologies.io',
    phone: '+1 (555) 234-5678',
    business: 'Apex Cloud Solutions',
    industry: 'Technology & Cloud',
  });

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'general':
        return <Settings className="w-4 h-4" />;
      case 'organization':
        return <Building className="w-4 h-4" />;
      case 'branding':
        return <Palette className="w-4 h-4" />;
      case 'rbac':
        return <ShieldCheck className="w-4 h-4" />;
      case 'profile':
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const visibleSections = settingsSectionsConfig.filter((sec) => {
    if (!sec.requiredPermission) return true;
    return can(sec.requiredPermission);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Settings Center</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal account, business profile, organization parameters, and RBAC matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="space-y-1 bg-card border rounded-2xl p-3 shadow-xs">
          {visibleSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors',
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-accent text-foreground'
              )}
            >
              {getSectionIcon(sec.id)}
              <div>
                <span className="block leading-none">{sec.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3 bg-card border rounded-2xl p-6 shadow-xs min-h-[500px]">
          {activeSection === 'profile' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Profile updated successfully!');
              }}
              className="space-y-4"
            >
              <div className="border-b pb-3 mb-2">
                <h3 className="font-bold text-base text-foreground">Business Profile</h3>
                <p className="text-xs text-muted-foreground">Manage your personal branding and contact parameters.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full px-3 py-2 rounded-lg border bg-muted text-xs outline-hidden cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Business Name</label>
                  <input
                    type="text"
                    value={profileData.business}
                    onChange={(e) => setProfileData({ ...profileData, business: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Industry Category</label>
                  <input
                    type="text"
                    value={profileData.industry}
                    onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                Save Profile
              </Button>
            </form>
          )}

          {activeSection === 'general' && (
            <div className="space-y-4">
              <div className="border-b pb-3 mb-2">
                <h3 className="font-bold text-base text-foreground">General Preferences</h3>
                <p className="text-xs text-muted-foreground">Configure system locale and notifications settings.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 border rounded-xl">
                  <div>
                    <span className="font-semibold block text-foreground">Automatic Time Zone Detection</span>
                    <span className="text-[11px] text-muted-foreground">Adjust display times based on local browser locale</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'organization' && (
            <div className="space-y-4">
              <div className="border-b pb-3 mb-2">
                <h3 className="font-bold text-base text-foreground">Organization Configuration</h3>
                <p className="text-xs text-muted-foreground">Manage organization name, active chapters, and domain rules.</p>
              </div>
              <p className="text-xs text-muted-foreground">Configure local parameters or adjust subscription states.</p>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className="space-y-4">
              <div className="border-b pb-3 mb-2">
                <h3 className="font-bold text-base text-foreground">White-Label Branding Settings</h3>
                <p className="text-xs text-muted-foreground">Set custom logos, primary brand themes, and domain redirects.</p>
              </div>
              <p className="text-xs text-muted-foreground">Branding rules and assets selector options.</p>
            </div>
          )}

          {activeSection === 'rbac' && (
            <div className="space-y-8">
              <div className="border-b pb-3 mb-2">
                <h3 className="font-bold text-base text-foreground">Roles & Permissions Matrix (RBAC)</h3>
                <p className="text-xs text-muted-foreground">Configure base role properties, permission matrices, and overrides.</p>
              </div>

              {/* Roles Cards Grid */}
              <RolesGrid roles={roles} onOpenCreateRole={() => setIsCreateRoleOpen(true)} />

              {/* Permissions Matrix */}
              <PermissionsMatrixTable
                roles={roles}
                permissions={permissions}
                onTogglePermission={togglePermissionForRole}
              />

              {/* User assignments table */}
              <UserRoleAssignmentTable
                assignments={assignments}
                roles={roles}
                onAssignRole={assignRoleToUser}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals for RBAC configuration */}
      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        permissions={permissions}
        onClose={() => setIsCreateRoleOpen(false)}
        onSubmit={createRole}
      />
    </div>
  );
}
