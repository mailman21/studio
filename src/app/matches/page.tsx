'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const pastMatches = [
    { id: 1, date: '2024-07-20', teams: 'Cheetahs vs Lions', competition: 'U21', result: '3-15' },
    { id: 2, date: '2024-07-13', teams: 'Bulls vs Sharks', competition: 'Currie Cup', result: '24-21' },
];

export default function MatchesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Past Matches" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Match History</CardTitle>
            <CardDescription>
              Review and edit details from previous matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-semibold">{match.teams}</p>
                  <p className="text-sm text-muted-foreground">{match.competition} - {match.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono text-lg">{match.result}</p>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Match</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
