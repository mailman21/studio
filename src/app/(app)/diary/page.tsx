'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Target, BookOpen, Upload, Video, Mic, PlayCircle, Trash2 } from 'lucide-react';
import { refereeProfileData } from '@/lib/users';
import type { RefereeProfile, UserRole, VideoClip } from '@/types';

export default function DiaryPage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<RefereeProfile | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

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
    
    const handleProfileChange = (field: keyof RefereeProfile, value: any) => {
        // This function now updates the state AND persists it to our mock data source.
        setProfile(prev => {
            const newProfile = prev ? { ...prev, [field]: value } : null;
            if (currentUserEmail && newProfile) {
                // Persist changes to the in-memory store immediately.
                refereeProfileData[currentUserEmail] = JSON.parse(JSON.stringify(newProfile));
            }
            return newProfile;
        });
    };

    const handleVideoUploadClick = () => {
        videoInputRef.current?.click();
    };

    const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && profile) {
            const newClip: VideoClip = {
                id: Date.now(),
                title: file.name,
                description: "A newly uploaded clip for review.",
                thumbnail: "https://placehold.co/600x400.png",
                hint: "rugby action"
            };
            // This will trigger the state update and immediate persistence.
            handleProfileChange('diaryVideoClips', [...profile.diaryVideoClips, newClip]);
            toast({
                title: 'Video Added',
                description: `${file.name} has been added to your diary and saved.`,
            });
        }
    };
    
    const handleDeleteVideo = (id: number) => {
        if (profile) {
            handleProfileChange('diaryVideoClips', profile.diaryVideoClips.filter(clip => clip.id !== id));
            toast({
                title: 'Video Removed',
                description: 'The video has been removed from your diary.',
            });
        }
    };

    const handleAddVoiceNote = () => {
        if (profile) {
            // In a real app, this would trigger a recording flow.
            // Here, we'll just add a placeholder.
            alert("This would start a voice recording and use AI for transcription. This feature is coming soon!");
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
            <PageHeader title="My Diary & Prep" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-6 w-6" />
                                Personal Development Goals
                            </CardTitle>
                            <CardDescription>
                                What are your key areas for improvement? Changes are saved automatically.
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-6 w-6" />
                                General Notes & Reflections
                            </CardTitle>
                            <CardDescription>
                                A place for any other thoughts, feelings, or reflections. Changes are saved automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Label htmlFor="notes-textarea" className="sr-only">General Notes</Label>
                            <Textarea
                                id="notes-textarea"
                                value={profile.generalNotes}
                                onChange={(e) => handleProfileChange('generalNotes', e.target.value)}
                                rows={10}
                                placeholder="e.g., Post-match thoughts, physical condition, mentality..."
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-6 w-6" />
                                Video Diary
                            </CardTitle>
                            <CardDescription>
                                Upload and review personal video clips for self-analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile.diaryVideoClips.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                {profile.diaryVideoClips.map((clip) => (
                                    <div key={clip.id} className="border rounded-lg overflow-hidden group relative">
                                        <div className="relative aspect-video">
                                            <Image 
                                                src={clip.thumbnail} 
                                                alt={clip.title} 
                                                fill
                                                className="object-cover"
                                                data-ai-hint={clip.hint} 
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlayCircle className="h-10 w-10 text-white" />
                                            </div>
                                             <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                                                onClick={() => handleDeleteVideo(clip.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete clip</span>
                                            </Button>
                                        </div>
                                        <div className="p-3 bg-card">
                                            <h3 className="font-semibold truncate text-sm">{clip.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-4">
                                    No video clips added to your diary yet.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" onClick={handleVideoUploadClick}>
                                <Upload className="mr-2 h-4 w-4" /> Upload Clip
                            </Button>
                            <input
                                type="file"
                                ref={videoInputRef}
                                onChange={handleVideoFileChange}
                                className="hidden"
                                accept="video/*"
                            />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="h-6 w-6" />
                                Voice Memos
                            </CardTitle>
                            <CardDescription>
                                Record audio notes for quick thoughts. Transcription would be handled by AI.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-8 text-center">
                                <Mic className="h-10 w-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Voice recording and transcription features are coming soon.
                                </p>
                                <Button onClick={handleAddVoiceNote}>
                                    Record Audio Note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
