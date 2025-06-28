'use client';

// This is the root page.
// It manually composes the layout and page for the authenticated dashboard
// to resolve the routing conflict between the root page and the (app) group page.

import AppPagesLayout from './(app)/layout';
import DashboardPage from './(app)/page';

export default function RootPage() {
  // By explicitly composing the authenticated layout and the dashboard page here,
  // we ensure that the user sees the correct content when they are logged in
  // and land on the root URL. The auth check is handled within AppPagesLayout.
  return (
    <AppPagesLayout>
      <DashboardPage />
    </AppPagesLayout>
  );
}
