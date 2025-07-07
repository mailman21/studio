'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { upcomingMatchesData, type UpcomingMatch } from '@/types';
import { Calendar, MapPin, PlusCircle, Upload, CalendarDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NewMatchDialog } from '@/components/new-match-dialog';

export default function PlanningPage() {
    const [matches, setMatches] = useState<UpcomingMatch[]>(() => JSON.parse(JSON.stringify(upcomingMatchesData)));
    const [isNewMatchDialogOpen, setIsNewMatchDialogOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

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

    const handleUploadClick = (matchId: number) => {
        setSelectedMatchId(matchId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedMatchId !== null) {
            const matchIndex = upcomingMatchesData.findIndex(m => m.id === selectedMatchId);
            if (matchIndex > -1) {
                // In a real app, you'd upload the file and store the URL.
                // For this demo, we'll just store the file name.
                upcomingMatchesData[matchIndex].prepDocUrl = file.name;
            }

            setMatches(currentMatches =>
                currentMatches.map(match =>
                    match.id === selectedMatchId ? { ...match, prepDocUrl: file.name } : match
                )
            );
            
            toast({
                title: 'Prep Document Uploaded',
                description: `${file.name} has been attached to the match.`,
            });
        }
    };
    
    const handleAddToCalendar = (match: UpcomingMatch) => {
        // Assume match starts at 3 PM local time and lasts 2 hours
        const startDate = new Date(`${match.date}T15:00:00`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const toIcsDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//WhistleWise//App//EN',
            'BEGIN:VEVENT',
            `UID:${match.id}@whistlewise.com`,
            `DTSTAMP:${toIcsDate(new Date())}`,
            `DTSTART:${toIcsDate(startDate)}`,
            `DTEND:${toIcsDate(endDate)}`,
            `SUMMARY:Match: ${match.teams}`,
            `DESCRIPTION:Competition: ${match.competition}\\nNotes: ${match.notes || 'No notes.'}`,
            `LOCATION:${match.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `whistlewise-match-${match.id}.ics`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: 'Calendar Event Downloaded',
            description: 'The match has been downloaded as an .ics file.',
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
                                <CardFooter className="justify-between items-center">
                                    <div>
                                    {match.prepDocUrl && (
                                        <p className="text-sm text-muted-foreground">
                                        Attached: <span className="font-medium text-foreground">{match.prepDocUrl}</span>
                                        </p>
                                    )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleAddToCalendar(match)}>
                                            <CalendarDown className="mr-2 h-4 w-4" />
                                            Add to Calendar
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleUploadClick(match.id)}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {match.prepDocUrl ? 'Replace Prep Doc' : 'Upload Prep Doc'}
                                        </Button>
                                    </div>
                                </CardFooter>
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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
            />
        </div>
    );
}
