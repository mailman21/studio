'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventTimeline } from '@/components/event-timeline';
import type { MatchEvent, PastMatch, GpsPoint } from '@/types';
import { matchesData } from '@/types';
import { ArrowLeft, Download, Pencil, Save, Upload } from 'lucide-react';
import { EditEventDialog, type DialogEvent } from '@/components/edit-event-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PerformanceAnalysis } from '@/components/performance-analysis';

export default function MatchDetailPage() {
    const params = useParams<{ id: string }>();

    const initialMatchData = matchesData.find(m => m.id.toString() === params.id);

    const [match, setMatch] = useState<PastMatch | undefined>(initialMatchData ? JSON.parse(JSON.stringify(initialMatchData)) : undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [dialogState, setDialogState] = useState<{ isOpen: boolean; event?: DialogEvent }>({ isOpen: false });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        const matchData = matchesData.find(m => m.id.toString() === params.id);
        setMatch(matchData ? JSON.parse(JSON.stringify(matchData)) : undefined);
        setIsEditing(false);
    }, [params.id]);

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

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleDetailChange = (field: keyof PastMatch, value: string | number) => {
        if (!match) return;
        setMatch(prevMatch => {
            if (!prevMatch) return prevMatch;
            
            const newMatch = { ...prevMatch, [field]: value };
    
            if (field === 'teamAName' || field === 'teamBName') {
                newMatch.teams = `${newMatch.teamAName} vs ${newMatch.teamBName}`;
            }
            
            return newMatch;
        });
    };

    const handleDeleteEvent = (eventId: string) => {
        if (!match) return;
        setMatch({
            ...match,
            events: match.events.filter(e => e.id !== eventId)
        });
    };

    const handleOpenDialog = (event?: MatchEvent) => {
        if (event) {
            setDialogState({ isOpen: true, event: { ...event } });
        } else {
            setDialogState({ isOpen: true, event: { id: `new-${Date.now()}`, time: 0, team: null, type: 'Comment', description: '' } });
        }
    };
    
    const handleSaveEvent = (savedEvent: DialogEvent) => {
        if (!match) return;

        const isNewEvent = savedEvent.id.toString().startsWith('new-');

        if (isNewEvent) {
            const newEvent: MatchEvent = {
                ...savedEvent,
                id: new Date().toISOString(),
            };
            setMatch({
                ...match,
                events: [...match.events, newEvent].sort((a, b) => a.time - b.time)
            });
        } else {
            setMatch({
                ...match,
                events: match.events.map(e => e.id === savedEvent.id ? { ...e, ...savedEvent } : e).sort((a, b) => a.time - b.time)
            });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name);
            alert(`File "${file.name}" selected. In a real app, this would be uploaded and the URL saved.`);
            // In a real app, you would upload the file and then call:
            // handleDetailChange('coachReportUrl', uploadedFileUrl);
        }
    };

    const handleGpsUpload = (file: File) => {
        // In a real app, you would parse the GPX/FIT file here.
        // For this demo, we'll just generate new simulated data to show the UI update.
        const generateGpsData = (durationInSeconds: number, points: number): GpsPoint[] => {
            const data: GpsPoint[] = [];
            let lastHeartRate = 120;
            for (let i = 0; i < points; i++) {
                const time = Math.floor((i / points) * durationInSeconds);
                lastHeartRate += (Math.random() - 0.48) * 10;
                lastHeartRate = Math.max(110, Math.min(185, lastHeartRate));
                const speed = time % 300 < 50 ? Math.random() * 2 + 5 : Math.random() * 4;
                data.push({
                    time,
                    heartRate: Math.round(lastHeartRate),
                    speed: parseFloat(speed.toFixed(2)),
                });
            }
            return data;
        };

        const newGpsData = generateGpsData(4800, 100);

        setMatch(prevMatch => {
            if (!prevMatch) return prevMatch;
            const updatedMatch = { ...prevMatch, gpsData: newGpsData };

            // Persist the change in our mock data source
            const matchIndex = matchesData.findIndex(m => m.id === updatedMatch.id);
            if (matchIndex !== -1) {
                matchesData[matchIndex] = updatedMatch;
            }

            return updatedMatch;
        });

        toast({
            title: "GPS Data Uploaded",
            description: `Simulated data from ${file.name} has been processed.`,
        });
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
                {isEditing ? (
                    <Button onClick={handleToggleEdit}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                ) : (
                    <Button onClick={handleToggleEdit} variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Match
                    </Button>
                )}
                <Button onClick={handleExport} variant="outline" disabled={isEditing}>
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
                        <CardDescription>
                            {isEditing ? (
                                <div className="flex gap-4 items-center pt-2">
                                    <Input type="date" value={match.date} onChange={(e) => handleDetailChange('date', e.target.value)} />
                                    <Input value={match.competition} onChange={(e) => handleDetailChange('competition', e.target.value)} placeholder="Competition"/>
                                </div>
                            ) : (
                                `${match.date} - ${match.competition}`
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-start gap-4">
                            {isEditing ? (
                                <div className="grid gap-4 w-full">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="teamAName" className="text-muted-foreground">Team A</Label>
                                            <Input id="teamAName" value={match.teamAName} onChange={(e) => handleDetailChange('teamAName', e.target.value)} />
                                        </div>
                                         <div>
                                            <Label htmlFor="teamBName" className="text-muted-foreground">Team B</Label>
                                            <Input id="teamBName" value={match.teamBName} onChange={(e) => handleDetailChange('teamBName', e.target.value)} />
                                        </div>
                                    </div>
                                     <div>
                                        <Label htmlFor="venue" className="text-muted-foreground">Venue</Label>
                                        <Input id="venue" value={match.venue} onChange={(e) => handleDetailChange('venue', e.target.value)} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-lg font-semibold">{match.teams}</div>
                                    <p className="text-sm text-muted-foreground">{match.venue}</p>
                                </div>
                            )}
                            <div className="text-2xl font-mono font-bold text-right shrink-0">{match.result}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Coach Feedback</CardTitle>
                        <CardDescription>Review and manage coach feedback for this match.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <Label htmlFor="coachRating">Coach Rating (/100)</Label>
                                        <Input 
                                            id="coachRating" 
                                            type="number" 
                                            value={match.coachRating || ''} 
                                            onChange={(e) => handleDetailChange('coachRating', parseInt(e.target.value, 10) || 0)} 
                                            max={100} 
                                            min={0}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Button variant="outline" onClick={handleUploadClick}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Report
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </div>
                                </div>
                                {match.coachReportUrl && (
                                    <p className="text-sm text-muted-foreground">
                                        Current report: <a href={match.coachReportUrl} target="_blank" rel="noopener noreferrer" className="underline">{match.coachReportUrl.split('/').pop()}</a>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Coach Rating</p>
                                    <p className="text-2xl font-bold">{match.coachRating ?? 'N/A'} / 100</p>
                                </div>
                                {match.coachReportUrl ? (
                                    <Button asChild variant="outline">
                                        <a href={match.coachReportUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            View Report
                                        </a>
                                    </Button>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No report uploaded.</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <PerformanceAnalysis match={match} onGpsUpload={handleGpsUpload} />
                
                <EventTimeline 
                    events={match.events} 
                    teamAName={match.teamAName} 
                    teamBName={match.teamBName}
                    isEditing={isEditing}
                    onAddEvent={() => handleOpenDialog()}
                    onEditEvent={handleOpenDialog}
                    onDeleteEvent={handleDeleteEvent}
                />
            </main>
            <EditEventDialog 
                dialogState={dialogState}
                setDialogState={setDialogState}
                onSave={handleSaveEvent}
                teamAName={match.teamAName}
                teamBName={match.teamBName}
            />
        </div>
    );
}
