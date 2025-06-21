'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventTimeline } from '@/components/event-timeline';
import type { MatchEvent } from '@/types';
import { ArrowLeft, Download } from 'lucide-react';

interface PastMatch {
    id: number;
    date: string;
    teams: string;
    competition: string;
    result: string;
    events: MatchEvent[];
    teamAName: string;
    teamBName: string;
}

const matchesData: PastMatch[] = [
    { 
        id: 1, 
        date: '2024-07-20', 
        teams: 'Cheetahs vs Lions',
        teamAName: 'Cheetahs',
        teamBName: 'Lions',
        competition: 'U21', 
        result: '3-15',
        events: [
            { id: '1a', time: 300, team: 'A', type: 'Penalty', subType: 'Offside', description: 'Cheetahs offside at the ruck' },
            { id: '1b', time: 650, team: 'B', type: 'Scrum', description: 'Scrum to Lions' },
            { id: '1c', time: 920, team: 'B', type: 'Penalty', subType: 'Foul Play', description: 'Lions high tackle' },
        ]
    },
    { 
        id: 2, 
        date: '2024-07-13', 
        teams: 'Bulls vs Sharks',
        teamAName: 'Bulls',
        teamBName: 'Sharks',
        competition: 'Currie Cup', 
        result: '24-21',
        events: [
            { id: '2a', time: 120, team: 'A', type: 'Error', description: 'Referee communication error' },
            { id: '2b', time: 800, team: 'B', type: 'Free-Kick', description: 'Free-kick to Sharks' },
            { id: '2c', time: 1500, team: 'A', type: 'Penalty', subType: 'Breakdown', description: 'Bulls holding on' },
            { id: '2d', time: 2100, team: null, type: 'Comment', description: 'Water break' },
        ]
    },
];

export default function MatchDetailPage({ params }: { params: { id: string } }) {
    const match = matchesData.find(m => m.id.toString() === params.id);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleExport = () => {
        if (!match) return;

        const headers = ['Timestamp', 'Team', 'Event Type', 'Sub-Type', 'Description'];
        const rows = match.events.map(event => [
            `"${formatTime(event.time)}"`,
            `"${event.team === 'A' ? match.teamAName : event.team === 'B' ? match.teamBName : 'N/A'}"`,
            `"${event.type}"`,
            `"${event.subType || ''}"`,
            `"${event.description.replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `match_${match.id}_events.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!match) {
        return (
            <div className="flex flex-col h-full">
                <PageHeader title="Match Not Found" />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold mb-4">Match Not Found</h2>
                    <p className="text-muted-foreground mb-4">The match you are looking for does not exist.</p>
                    <Button asChild>
                        <Link href="/matches">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Matches
                        </Link>
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={match.teams}>
                <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Timeline
                </Button>
                <Button asChild variant="outline">
                    <Link href="/matches">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Matches
                    </Link>
                </Button>
            </PageHeader>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Match Details</CardTitle>
                        <CardDescription>{match.date} - {match.competition}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">{match.teams}</div>
                            <div className="text-2xl font-mono font-bold">{match.result}</div>
                        </div>
                    </CardContent>
                </Card>

                <EventTimeline events={match.events} teamAName={match.teamAName} teamBName={match.teamBName} />
            </main>
        </div>
    );
}
