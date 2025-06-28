'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CoachDashboard() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Coach Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Coach!</CardTitle>
            <CardDescription>
              This is the coach dashboard. More features coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can review match reports, provide feedback on referees, and track team performance here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
