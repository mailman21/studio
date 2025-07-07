'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Target, ClipboardCheck, BookOpen } from 'lucide-react';

export default function DiaryPage() {
    const { toast } = useToast();
    const [goals, setGoals] = useState('1. Improve positioning at the scrum.\n2. Quicker decisions at the breakdown.');
    const [prep, setPrep] = useState('Reviewed clips from last week\'s game. Focused on communication with assistant referees.');
    const [notes, setNotes] = useState('Feeling confident for the upcoming match. Weather forecast looks clear.');

    const handleSaveChanges = () => {
        // In a real app, this would save to a database.
        toast({
            title: 'Diary Saved!',
            description: 'Your notes and goals have been updated.',
        });
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="My Diary & Prep">
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </PageHeader>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-6 w-6" />
                            Personal Development Goals
                        </CardTitle>
                        <CardDescription>
                            What are your key areas for improvement? Set long-term and short-term goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="goals-textarea" className="sr-only">Personal Goals</Label>
                        <Textarea
                            id="goals-textarea"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            rows={5}
                            placeholder="e.g., Maintain 5m discipline, clearer communication..."
                        />
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardCheck className="h-6 w-6" />
                                Match Prep Diary
                            </CardTitle>
                            <CardDescription>
                                Log your preparation activities for upcoming matches.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="prep-textarea" className="sr-only">Match Prep Diary</Label>
                            <Textarea
                                id="prep-textarea"
                                value={prep}
                                onChange={(e) => setPrep(e.target.value)}
                                rows={8}
                                placeholder="e.g., Reviewed team lineups, watched clips of specific players..."
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-6 w-6" />
                                General Notes & Reflections
                            </CardTitle>
                            <CardDescription>
                                A place for any other thoughts, feelings, or reflections.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Label htmlFor="notes-textarea" className="sr-only">General Notes</Label>
                            <Textarea
                                id="notes-textarea"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={8}
                                placeholder="e.g., Post-match thoughts, physical condition, mentality..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
