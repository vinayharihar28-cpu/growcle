import { WorkspaceConfig } from './types';

export const financeNavigationConfig: WorkspaceConfig = {
  id: 'finance',
  label: 'Finance Workspace',
  description: 'Manage member dues, renewal invoices, and financial reports',
  badge: 'Finance',
  navigation: [
    {
      groupTitle: 'Revenue Operations',
      items: [
        { title: 'Finance Overview', href: '/dashboard', iconName: 'LayoutDashboard', requiredPermission: 'finance.view' },
        { title: 'Invoices & Fees', href: '/dashboard/invoices', iconName: 'FileText', requiredPermission: 'finance.view' },
        { title: 'Billing Center', href: '/dashboard/billing', iconName: 'CreditCard', requiredPermission: 'finance.view' },
      ],
    },
  ],
};
