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
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { MatchEvent } from '@/types';

interface EventTimelineProps {
  events: MatchEvent[];
  teamAName: string;
  teamBName: string;
  isEditing?: boolean;
  onAddEvent?: () => void;
  onEditEvent?: (event: MatchEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function EventTimeline({ events, teamAName, teamBName, isEditing, onAddEvent, onEditEvent, onDeleteEvent }: EventTimelineProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Timeline</CardTitle>
          <CardDescription>A chronological log of all match events.</CardDescription>
        </div>
        {isEditing && (
            <Button onClick={onAddEvent} size="sm" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
            </Button>
        )}
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
                {isEditing && <TableHead className="w-[120px] text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={isEditing ? 5 : 4} className="h-24 text-center">
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
                            <div className="flex items-center">
                                <Badge variant="secondary">{event.type}</Badge>
                                {event.subType && <span className="text-muted-foreground ml-2 text-xs">({event.subType})</span>}
                            </div>
                        </TableCell>
                        <TableCell className="max-w-[400px] truncate">{event.description}</TableCell>
                        {isEditing && (
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => onEditEvent?.(event)}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteEvent?.(event.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                        )}
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
