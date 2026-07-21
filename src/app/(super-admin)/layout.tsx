import { ReactNode } from 'react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Super Admin Sidebar Placeholder */}
      <aside className="w-64 border-r hidden md:block bg-slate-900 text-white" />
      <div className="flex flex-1 flex-col">
        {/* Header Placeholder */}
        <header className="h-16 border-b" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
