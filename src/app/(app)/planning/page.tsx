'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { upcomingMatchesData, type UpcomingMatch } from '@/types';
import { Calendar, MapPin, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlanningPage() {
    const [matches, setMatches] = useState<UpcomingMatch[]>(upcomingMatchesData);
    const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
    const { toast } = useToast();

    const handleNoteChange = (matchId: number, newNotes: string) => {
        setMatches(currentMatches =>
            currentMatches.map(match =>
                match.id === matchId ? { ...match, notes: newNotes } : match
            )
        );
    };

    const handleSaveNote = (matchId: number) => {
        // In a real app, this would save the note to a database.
        const match = matches.find(m => m.id === matchId);
        toast({
            title: `Notes for ${match?.teams} saved!`,
        });
        setEditingMatchId(null);
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Future Match Planning" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-6">
                    {matches.map(match => (
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
                                    placeholder="Add your pre-match thoughts, team analysis, key players to watch..."
                                    readOnly={editingMatchId !== match.id}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                {editingMatchId === match.id ? (
                                    <Button onClick={() => handleSaveNote(match.id)}>
                                        <Save className="mr-2 h-4 w-4" /> Save Notes
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={() => setEditingMatchId(match.id)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit Notes
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
