'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MatchEvent } from '@/types';

interface EventTimelineProps {
  events: MatchEvent[];
  teamAName: string;
  teamBName: string;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function EventTimeline({ events, teamAName, teamBName }: EventTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Timeline</CardTitle>
        <CardDescription>A chronological log of all match events.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Timestamp</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        No events logged yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    events.map(event => (
                        <TableRow key={event.id}>
                        <TableCell className="font-mono">{formatTime(event.time)}</TableCell>
                        <TableCell>
                            {event.team === 'A' ? teamAName : event.team === 'B' ? teamBName : 'N/A'}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{event.type}</Badge>
                        </TableCell>
                        <TableCell>{event.description}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
