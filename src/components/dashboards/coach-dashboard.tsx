'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { users, refereeProfileData } from '@/lib/users';
import type { RefereeProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Save, User, ClipboardList, Video } from 'lucide-react';

const referees = users.filter(u => u.role === 'referee');

export function CoachDashboard() {
  const [selectedRefereeEmail, setSelectedRefereeEmail] = useState<string | undefined>(referees[0]?.email);
  const [profileData, setProfileData] = useState<RefereeProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedRefereeEmail && refereeProfileData[selectedRefereeEmail]) {
      setProfileData(JSON.parse(JSON.stringify(refereeProfileData[selectedRefereeEmail])));
    } else {
      setProfileData(null);
    }
  }, [selectedRefereeEmail]);

  const handleSelectReferee = (email: string) => {
    setSelectedRefereeEmail(email);
  };

  const handleProfileChange = (field: keyof RefereeProfile, value: string) => {
    setProfileData(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSaveChanges = () => {
    if (selectedRefereeEmail && profileData) {
      refereeProfileData[selectedRefereeEmail] = JSON.parse(JSON.stringify(profileData));
      toast({
        title: 'Profile Updated',
        description: `Changes for ${referees.find(r => r.email === selectedRefereeEmail)?.name} have been saved.`,
      });
    } else {
        toast({
            title: 'Error',
            description: 'Could not save changes. No referee selected or profile data is missing.',
            variant: 'destructive',
        });
    }
  };
  
  const getRefereeName = (email?: string) => {
    if (!email) return 'N/A';
    return users.find(u => u.email === email)?.name || 'Unknown Referee';
  }

  if (!selectedRefereeEmail) {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Coach Dashboard" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <Card>
                <CardHeader>
                    <CardTitle>No Referees Found</CardTitle>
                    <CardDescription>
                    There are no referees in the system to manage.
                    </CardDescription>
                </CardHeader>
                </Card>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Coach Dashboard">
        <Button onClick={handleSaveChanges} disabled={!profileData}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes for {getRefereeName(selectedRefereeEmail)}
        </Button>
      </PageHeader>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5"/>
                    Select Referee
                </CardTitle>
                <CardDescription>
                    Choose a referee to view their matches and provide feedback.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Select onValueChange={handleSelectReferee} value={selectedRefereeEmail}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a referee" />
                    </SelectTrigger>
                    <SelectContent>
                        {referees.map(ref => (
                            <SelectItem key={ref.email} value={ref.email}>{ref.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        {profileData ? (
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ClipboardList className="h-5 w-5" />
                           Development & Notes
                        </CardTitle>
                        <CardDescription>
                           Provide specific work-ons and notes for the selected referee. These will appear on their profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="work-ons">Work-ons</Label>
                            <Textarea
                                id="work-ons"
                                className="mt-2"
                                placeholder="Key development areas..."
                                value={profileData.workOns}
                                onChange={(e) => handleProfileChange('workOns', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="pre-match-notes">Pre-Match Notes</Label>
                            <Textarea
                                id="pre-match-notes"
                                className="mt-2"
                                placeholder="Team tendencies, specific plays..."
                                value={profileData.preMatchNotes}
                                onChange={(e) => handleProfileChange('preMatchNotes', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="video-review">Video Review Focus</Label>
                            <Textarea
                                id="video-review"
                                className="mt-2"
                                placeholder="Clips to review, focus points..."
                                value={profileData.videoReview}
                                onChange={(e) => handleProfileChange('videoReview', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            Manage Video Library
                        </CardTitle>
                        <CardDescription>
                            Add video clips for the referee to review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* A simple form to add a new video clip. In a real app this would involve uploads. */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h4 className="font-medium">Add New Clip</h4>
                             <div className="space-y-2">
                                <Label htmlFor="clip-title">Clip Title</Label>
                                <Input id="clip-title" placeholder="e.g., Critical Tackle Review" />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="clip-desc">Description</Label>
                                <Textarea id="clip-desc" placeholder="Notes about what to look for in the clip." />
                             </div>
                             <Button disabled>Add Clip (Upload Disabled)</Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Currently showing {profileData.videoClips.length} clips in the referee's library.
                            Video upload is a placeholder for this demo.
                        </p>
                    </CardContent>
                </Card>
            </div>
        ) : (
            <Card>
                <CardContent className="p-6">
                    <p>This referee does not have a profile yet.</p>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
