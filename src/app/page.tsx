'use client';

import React, { useState, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { TimerComponent } from '@/components/timer-component';
import { EventDialog, type DialogState } from '@/components/event-dialog';
import { EventTimeline } from '@/components/event-timeline';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MatchEvent, EventType } from '@/types';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Zap,
  RotateCcw,
  PlusCircle,
  ArrowLeftRight,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const eventIcons: Record<EventType, React.ElementType> = {
  Penalty: ShieldAlert,
  Error: AlertTriangle,
  'Non-Decision': HelpCircle,
  Scrum: Zap,
  'Free-Kick': CheckCircle,
  'Positive HID': PlusCircle,
  Comment: MessageSquare,
  Lineout: ArrowLeftRight,
  'L2M': Clock,
};

function TeamPanel({
  teamName,
  team,
  onLogEvent,
  onOpenDialog,
}: {
  teamName: string;
  team: 'A' | 'B';
  onLogEvent: (type: EventType, subType?: string) => void;
  onOpenDialog: (type: EventType) => void;
}) {
  const penaltySubTypes = ['Offside', 'Breakdown', 'Scrum', 'Lineout', 'L2m', 'Foul Play'];
  const nonDecisionSubTypes = ['Offside', 'ND', 'Error', 'Foul Play', 'Scrum', 'L2M', 'General play'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <ShieldAlert className="size-4" /> Penalty
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {penaltySubTypes.map(subType => (
              <DropdownMenuItem key={subType} onClick={() => onOpenDialog('Penalty')}>
                {subType}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onOpenDialog('Error')}>
          <AlertTriangle className="size-4" /> Error
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <HelpCircle className="size-4" /> Non-Decision
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {nonDecisionSubTypes.map(subType => (
              <DropdownMenuItem key={subType} onClick={() => onOpenDialog('Non-Decision')}>
                {subType}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
            <Button variant="outline" className="flex-1 justify-start gap-2" onClick={() => onLogEvent('Scrum')}>
                <Zap className="size-4" /> Scrum
            </Button>
            <Button variant="outline" size="icon" onClick={() => onLogEvent('Scrum', 'Reset')}>
                <RotateCcw className="size-4" />
                <span className="sr-only">Scrum Reset</span>
            </Button>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline" className="flex-1 justify-start gap-2" onClick={() => onLogEvent('Lineout')}>
                <ArrowLeftRight className="size-4" /> Lineout
            </Button>
            <Button variant="outline" size="icon" onClick={() => onLogEvent('L2M')}>
                <Clock className="size-4" />
                <span className="sr-only">L2M</span>
            </Button>
        </div>

        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onLogEvent('Free-Kick')}>
          <CheckCircle className="size-4" /> Free-Kick
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onLogEvent('Positive HID')}>
          <PlusCircle className="size-4" /> Positive HID
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onOpenDialog('Comment')}>
          <MessageSquare className="size-4" /> Comment
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MatchPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false });
  const [teamA, setTeamA] = useState('Team A');
  const [teamB, setTeamB] = useState('Team B');
  const [competition, setCompetition] = useState('U21');
  const [venue, setVenue] = useState('Local Pitch');


  const addEvent = useCallback(
    (event: Omit<MatchEvent, 'id' | 'time'>) => {
      setEvents(prev => [
        { ...event, id: new Date().toISOString(), time },
        ...prev,
      ]);
    },
    [time]
  );

  const handleLogEvent = (
    team: 'A' | 'B' | null,
    type: EventType,
    subType?: string
  ) => {
    addEvent({
      team,
      type,
      subType,
      description: subType ? `${type}: ${subType}` : type,
    });
  };

  const handleOpenDialog = (
    team: 'A' | 'B' | null,
    type: EventType
  ) => {
    setDialogState({ isOpen: true, team, type });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Live Match" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
                <CardTitle>Match Setup</CardTitle>
                <CardDescription>Enter the details for the match before you start the timer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="teamA">Team A (Home)</Label>
                        <Input id="teamA" value={teamA} onChange={(e) => setTeamA(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="teamB">Team B (Away)</Label>
                        <Input id="teamB" value={teamB} onChange={(e) => setTeamB(e.target.value)} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="competition">Competition</Label>
                        <Input id="competition" value={competition} onChange={(e) => setCompetition(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
                    </div>
                </div>
            </CardContent>
          </Card>
          <TimerComponent
            time={time}
            setTime={setTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TeamPanel
            teamName={teamA}
            team="A"
            onLogEvent={(type, subType) => handleLogEvent('A', type, subType)}
            onOpenDialog={(type) => handleOpenDialog('A', type)}
          />
          <TeamPanel
            teamName={teamB}
            team="B"
            onLogEvent={(type, subType) => handleLogEvent('B', type, subType)}
            onOpenDialog={(type) => handleOpenDialog('B', type)}
          />
        </div>

        <EventTimeline events={events} teamAName={teamA} teamBName={teamB} />
      </main>

      <EventDialog
        dialogState={dialogState}
        setDialogState={setDialogState}
        addEvent={addEvent}
      />
    </div>
  );
}
