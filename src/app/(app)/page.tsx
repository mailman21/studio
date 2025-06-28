'use client';

import { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/users';
import { RefereeDashboard } from '@/components/dashboards/referee-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { CoachDashboard } from '@/components/dashboards/coach-dashboard';

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // This check is client-side only.
    if (typeof window !== 'undefined') {
      const userRole = sessionStorage.getItem('userRole') as UserRole | null;
      setRole(userRole);
    }
  }, []);

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  switch (role) {
    case 'administrator':
      return <AdminDashboard />;
    case 'coach':
      return <CoachDashboard />;
    case 'referee':
      return <RefereeDashboard />;
    default:
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Unknown role. Please log out and try again.</p>
        </div>
      );
  }
}
