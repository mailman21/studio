'use client';

import { AppLayout } from '@/components/app-layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // This check is client-side only.
    if (typeof window !== 'undefined') {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      if (isAuthenticated === 'true') {
        setIsAuthorized(true);
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  if (!isAuthorized) {
    // You can return a loading spinner or a blank page while redirecting
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
