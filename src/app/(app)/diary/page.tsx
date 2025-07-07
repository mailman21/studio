'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Target, ClipboardCheck, BookOpen } from 'lucide-react';
import { refereeProfileData } from '@/lib/users';
import type { RefereeProfile, UserRole } from '@/types';

export default function DiaryPage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<RefereeProfile | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const email = sessionStorage.getItem('userEmail');
            const role = sessionStorage.getItem('userRole') as UserRole;
            if (email && role === 'referee' && refereeProfileData[email]) {
                setCurrentUserEmail(email);
                setProfile(JSON.parse(JSON.stringify(refereeProfileData[email])));
            }
        }
    }, []);
    
    const handleProfileChange = (field: keyof RefereeProfile, value: string) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSaveChanges = () => {
        if (currentUserEmail && profile) {
            refereeProfileData[currentUserEmail] = JSON.parse(JSON.stringify(profile));
            toast({
                title: 'Diary Saved!',
                description: 'Your notes and goals have been updated.',
            });
        }
    };
    
    if (!profile) {
        return (
            <div className="flex flex-col h-full">
                <PageHeader title="My Diary & Prep" />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
                    <p>Loading diary...</p>
                </main>
            </div>
        );
    }

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
                            value={profile.developmentGoals}
                            onChange={(e) => handleProfileChange('developmentGoals', e.target.value)}
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
                                value={profile.matchPrepDiary}
                                onChange={(e) => handleProfileChange('matchPrepDiary', e.target.value)}
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
                                value={profile.generalNotes}
                                onChange={(e) => handleProfileChange('generalNotes', e.target.value)}
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
