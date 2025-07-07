'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { upcomingMatchesData, type UpcomingMatch } from '@/types';
import { Calendar, MapPin, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NewMatchDialog } from '@/components/new-match-dialog';

export default function PlanningPage() {
    const [matches, setMatches] = useState<UpcomingMatch[]>(() => JSON.parse(JSON.stringify(upcomingMatchesData)));
    const [isNewMatchDialogOpen, setIsNewMatchDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleNoteChange = (matchId: number, newNotes: string) => {
        const matchIndex = upcomingMatchesData.findIndex(m => m.id === matchId);
        if (matchIndex > -1) {
            upcomingMatchesData[matchIndex].notes = newNotes;
        }
        
        setMatches(currentMatches =>
            currentMatches.map(match =>
                match.id === matchId ? { ...match, notes: newNotes } : match
            )
        );
    };

    const handleAddNewMatch = (newMatchData: Omit<UpcomingMatch, 'id' | 'notes'>) => {
        const newId = Math.max(0, ...upcomingMatchesData.map(m => m.id), ...matches.map(m => m.id)) + 1;
        const newMatch: UpcomingMatch = {
            id: newId,
            ...newMatchData,
            notes: '',
        };
        
        upcomingMatchesData.push(newMatch);
        setMatches(prev => [...prev, newMatch].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        
        toast({
            title: 'Match Added!',
            description: `${newMatch.teams} has been added to your upcoming matches.`,
        });
    };

    useEffect(() => {
        setMatches(JSON.parse(JSON.stringify(upcomingMatchesData)));
    }, []);


    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Future Match Planning">
                <Button onClick={() => setIsNewMatchDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Match
                </Button>
            </PageHeader>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-6">
                    {matches.length > 0 ? (
                        matches.map(match => (
                            <Card key={match.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{match.teams}</CardTitle>
                                            <CardDescription className="pt-1">{match.competition}</CardDescription>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p className="flex items-center justify-end gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" /> {match.date}
                                            </p>
                                            <p className="flex items-center justify-end gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" /> {match.location}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Label htmlFor={`notes-${match.id}`}>My Prep Notes</Label>
                                    <Textarea
                                        id={`notes-${match.id}`}
                                        className="mt-2"
                                        value={match.notes || ''}
                                        onChange={e => handleNoteChange(match.id, e.target.value)}
                                        placeholder="Add your pre-match thoughts, team analysis, key players to watch... Notes save automatically."
                                    />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                         <Card>
                            <CardContent className="p-6 text-center text-muted-foreground">
                                No upcoming matches planned. Add one to get started!
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <NewMatchDialog
                isOpen={isNewMatchDialogOpen}
                onOpenChange={setIsNewMatchDialogOpen}
                onSave={handleAddNewMatch}
            />
        </div>
    );
}
