'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RbacRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings');
  }, [router]);

  return (
    <div className="py-12 text-center text-xs text-muted-foreground">
      Redirecting to Settings Center...
    </div>
  );
}
