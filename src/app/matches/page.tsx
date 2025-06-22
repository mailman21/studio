'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { matchesData } from '@/types';

export default function MatchesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Past Matches" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Match History</CardTitle>
            <CardDescription>
              Review and view details from previous matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchesData.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`} className="block rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-semibold">{match.teams}</p>
                    <p className="text-sm text-muted-foreground">{match.competition} - {match.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-lg">{match.result}</p>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
