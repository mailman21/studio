'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import type { MatchEvent, EventType, PastMatch } from '@/types';
import { matchesData, penaltySubTypes, nonDecisionSubTypes, upcomingMatchesData } from '@/types';
import { useToast } from '@/hooks/use-toast';
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
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  onOpenDialog: (type: EventType, subType?: string) => void;
}) {
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
              <DropdownMenuItem key={subType} onClick={() => onOpenDialog('Penalty', subType)}>
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
              <DropdownMenuItem key={subType} onClick={() => onOpenDialog('Non-Decision', subType)}>
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
  const [selectedUpcomingMatchId, setSelectedUpcomingMatchId] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();


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
    type: EventType,
    subType?: string
  ) => {
    setDialogState({ isOpen: true, team, type, subType });
  };
  
  const handleFinishMatch = () => {
    setIsRunning(false);
  
    const newMatch: PastMatch = {
      id: Math.max(0, ...matchesData.map(m => m.id)) + 1,
      date: new Date().toISOString().split('T')[0],
      teams: `${teamA} vs ${teamB}`,
      competition,
      venue,
      result: 'N/A', // Placeholder result, can be edited later
      events: [...events].reverse(), // Reverse to get chronological order
      teamAName: teamA,
      teamBName: teamB,
    };
  
    matchesData.push(newMatch);
  
    toast({
      title: "Match Saved!",
      description: "The live match has been saved to your history.",
    });

    if (selectedUpcomingMatchId) {
      const index = upcomingMatchesData.findIndex(m => m.id === selectedUpcomingMatchId);
      if (index > -1) {
        upcomingMatchesData.splice(index, 1);
      }
    }
  
    // Reset state for next match
    setTime(0);
    setEvents([]);
    setTeamA('Team A');
    setTeamB('Team B');
    setCompetition('U21');
    setVenue('Local Pitch');
    setSelectedUpcomingMatchId(null);
  
    router.push(`/matches/${newMatch.id}`);
  };

  const handleSelectUpcomingMatch = (matchId: string) => {
    const id = parseInt(matchId, 10);
    const selectedMatch = upcomingMatchesData.find(m => m.id === id);
    if (selectedMatch) {
      setSelectedUpcomingMatchId(id);
      const teams = selectedMatch.teams.split(' vs ');
      setTeamA(teams[0] || 'Team A');
      setTeamB(teams[1] || 'Team B');
      setCompetition(selectedMatch.competition);
      setVenue(selectedMatch.location);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Live Match">
        <Button onClick={handleFinishMatch} disabled={events.length === 0 && time === 0}>
            <Save className="mr-2 h-4 w-4" />
            Finish & Save Match
        </Button>
      </PageHeader>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
                <CardTitle>Match Setup</CardTitle>
                <CardDescription>Enter the details for the match or select a planned match to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="upcoming-match">Select Planned Match (Optional)</Label>
                  <Select onValueChange={handleSelectUpcomingMatch} disabled={isRunning || events.length > 0}>
                    <SelectTrigger id="upcoming-match">
                      <SelectValue placeholder="Select from your planned matches" />
                    </SelectTrigger>
                    <SelectContent>
                      {upcomingMatchesData.map(match => (
                        <SelectItem key={match.id} value={match.id.toString()}>
                          {match.teams} - {match.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="teamA">Team A (Home)</Label>
                        <Input id="teamA" value={teamA} onChange={(e) => setTeamA(e.target.value)} disabled={isRunning || events.length > 0} />
                    </div>
                    <div>
                        <Label htmlFor="teamB">Team B (Away)</Label>
                        <Input id="teamB" value={teamB} onChange={(e) => setTeamB(e.target.value)} disabled={isRunning || events.length > 0} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="competition">Competition</Label>
                        <Input id="competition" value={competition} onChange={(e) => setCompetition(e.target.value)} disabled={isRunning || events.length > 0} />
                    </div>
                    <div>
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} disabled={isRunning || events.length > 0} />
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
            onOpenDialog={(type, subType) => handleOpenDialog('A', type, subType)}
          />
          <TeamPanel
            teamName={teamB}
            team="B"
            onLogEvent={(type, subType) => handleLogEvent('B', type, subType)}
            onOpenDialog={(type, subType) => handleOpenDialog('B', type, subType)}
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
