'use client';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Calendar, Clock, Zap, Upload, PlayCircle, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { refereeProfileData, users } from '@/lib/users';
import type { RefereeProfile, FitnessTest, ScheduleItem, UserRole, VideoClip, VideoClipCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { videoClipCategories } from '@/types';
import { Badge } from '@/components/ui/badge';

function FitnessTestDialog({ isOpen, onOpenChange, onSave, test }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (test: FitnessTest) => void, test: FitnessTest | null }) {
    const [formData, setFormData] = useState<Omit<FitnessTest, 'id'>>({ test: '', result: '', date: '' });

    useEffect(() => {
        if (test) {
            setFormData({ test: test.test, result: test.result, date: test.date });
        } else {
            setFormData({ test: '', result: '', date: new Date().toISOString().split('T')[0] });
        }
    }, [test, isOpen]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ id: test?.id || new Date().toISOString(), ...formData });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{test ? 'Edit Fitness Test' : 'Add Fitness Test'}</DialogTitle>
                    <DialogDescription>
                        {test ? 'Update the details of your fitness test result.' : 'Add a new fitness test result to your profile.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="test-name" className="text-right">Test Name</Label>
                        <Input id="test-name" value={formData.test} onChange={e => handleChange('test', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="test-result" className="text-right">Result</Label>
                        <Input id="test-result" value={formData.result} onChange={e => handleChange('result', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="test-date" className="text-right">Date</Label>
                        <Input id="test-date" type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function TrainingScheduleDialog({ isOpen, onOpenChange, onSave, item }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (item: ScheduleItem) => void, item: ScheduleItem | null }) {
    const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'>>({ activity: '', date: '', location: '' });

    useEffect(() => {
        if (item) {
            setFormData({ activity: item.activity, date: item.date, location: item.location });
        } else {
            setFormData({ activity: '', date: '', location: '' });
        }
    }, [item, isOpen]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ id: item?.id || new Date().toISOString(), ...formData });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item ? 'Edit Schedule Item' : 'Add Schedule Item'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="item-activity">Activity</Label>
                        <Input id="item-activity" value={formData.activity} onChange={e => handleChange('activity', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-date">Date & Time</Label>
                        <Input id="item-date" value={formData.date} onChange={e => handleChange('date', e.target.value)} placeholder="e.g., Monday, 5:00 PM" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-location">Location</Label>
                        <Input id="item-location" value={formData.location} onChange={e => handleChange('location', e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function VideoClipDialog({ isOpen, onOpenChange, onSave, clip }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (clip: VideoClip) => void, clip: VideoClip | null }) {
    const [formData, setFormData] = useState<Omit<VideoClip, 'id'>>({ title: '', description: '', category: 'Personal Review', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby analysis' });

    useEffect(() => {
        if (clip) {
            setFormData({ title: clip.title, description: clip.description, category: clip.category, thumbnail: clip.thumbnail, hint: clip.hint });
        } else {
            setFormData({ title: '', description: '', category: 'Personal Review', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby analysis' });
        }
    }, [clip, isOpen]);

    const handleChange = (field: keyof Omit<VideoClip, 'id'>, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ id: clip?.id || Date.now(), ...formData });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{clip ? 'Edit Video Clip' : 'Add Video Clip'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="clip-title">Title</Label>
                        <Input id="clip-title" value={formData.title} onChange={e => handleChange('title', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="clip-category">Category</Label>
                        <Select onValueChange={(value) => handleChange('category', value as VideoClipCategory)} value={formData.category}>
                            <SelectTrigger id="clip-category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {videoClipCategories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clip-description">Description</Label>
                        <Textarea id="clip-description" value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ProfilePage() {
  const { toast } = useToast();
  
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<RefereeProfile | null>(null);
  
  const [isFitnessTestDialogOpen, setIsFitnessTestDialogOpen] = useState(false);
  const [editingFitnessTest, setEditingFitnessTest] = useState<FitnessTest | null>(null);
  
  const [isTrainingScheduleDialogOpen, setIsTrainingScheduleDialogOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);

  const [isVideoClipDialogOpen, setIsVideoClipDialogOpen] = useState(false);
  const [editingVideoClip, setEditingVideoClip] = useState<VideoClip | null>(null);

  useEffect(() => {
    // This check is client-side only.
    if (typeof window !== 'undefined') {
        const email = sessionStorage.getItem('userEmail');
        const role = sessionStorage.getItem('userRole') as UserRole;
        if (email) {
            setCurrentUserEmail(email);
            if (role === 'referee' && refereeProfileData[email]) {
                setProfile(JSON.parse(JSON.stringify(refereeProfileData[email])));
            }
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
        title: 'Profile Saved',
        description: 'Your changes have been successfully saved.',
      });
    }
  };

  const handleOpenFitnessTestDialog = (test: FitnessTest | null) => {
    setEditingFitnessTest(test);
    setIsFitnessTestDialogOpen(true);
  };

  const handleSaveFitnessTest = (test: FitnessTest) => {
    if (!profile) return;
    const newProfile = { ...profile };
    if (editingFitnessTest) {
      newProfile.fitnessTests = profile.fitnessTests.map(t => t.id === test.id ? test : t);
    } else {
      newProfile.fitnessTests = [...profile.fitnessTests, { ...test, id: new Date().toISOString() }];
    }
    setProfile(newProfile);
    setIsFitnessTestDialogOpen(false);
    setEditingFitnessTest(null);
  };

  const handleDeleteFitnessTest = (testId: string) => {
    if (!profile) return;
    setProfile({ ...profile, fitnessTests: profile.fitnessTests.filter(t => t.id !== testId) });
  };
  
  const handleOpenTrainingScheduleDialog = (item: ScheduleItem | null) => {
    setEditingScheduleItem(item);
    setIsTrainingScheduleDialogOpen(true);
  };

  const handleSaveScheduleItem = (item: ScheduleItem) => {
    if (!profile) return;
    const newProfile = { ...profile };
    if (editingScheduleItem) {
      newProfile.trainingSchedule = profile.trainingSchedule.map(s => s.id === item.id ? item : s);
    } else {
      newProfile.trainingSchedule = [...profile.trainingSchedule, { ...item, id: new Date().toISOString() }];
    }
    setProfile(newProfile);
    setIsTrainingScheduleDialogOpen(false);
    setEditingScheduleItem(null);
  };
  
  const handleDeleteScheduleItem = (itemId: string) => {
    if (!profile) return;
    setProfile({ ...profile, trainingSchedule: profile.trainingSchedule.filter(s => s.id !== itemId) });
  };
  
  const handleOpenVideoClipDialog = (clip: VideoClip | null) => {
    setEditingVideoClip(clip);
    setIsVideoClipDialogOpen(true);
  };
  
  const handleSaveVideoClip = (clip: VideoClip) => {
    if (!profile) return;
    const newProfile = { ...profile };
    if (editingVideoClip) {
        newProfile.videoClips = profile.videoClips.map(c => c.id === clip.id ? clip : c);
    } else {
        newProfile.videoClips = [...profile.videoClips, { ...clip, id: Date.now() }];
    }
    setProfile(newProfile);
    setIsVideoClipDialogOpen(false);
    setEditingVideoClip(null);
  };

  const handleDeleteVideoClip = (clipId: number) => {
    if (!profile) return;
    setProfile({ ...profile, videoClips: profile.videoClips.filter(c => c.id !== clipId) });
  };

  const currentUser = users.find(u => u.email === currentUserEmail);

  if (!currentUser) {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="My Profile" />
            <main className="flex-1 p-6 flex items-center justify-center">
              <p>Loading profile...</p>
            </main>
        </div>
    );
  }

  // Handle non-referee users
  if (currentUser.role !== 'referee') {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="My Profile" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  alt={currentUser.name}
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5">
                <CardTitle className="text-3xl">{currentUser.name}</CardTitle>
                <CardDescription className="capitalize">
                  Role: {currentUser.role}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Email: {currentUser.email}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Detailed profile management is available for referee accounts.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Handle referee profile not having loaded yet
  if (!profile) {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="My Profile" />
            <main className="flex-1 p-6 flex items-center justify-center">
              <p>Loading referee profile data...</p>
            </main>
        </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="My Profile">
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </PageHeader>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://placehold.co/100x100.png"
                alt="Referee"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <CardTitle className="text-3xl">{currentUser.name}</CardTitle>
              <CardDescription>
                Personal details and account settings.
              </CardDescription>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age" className="text-muted-foreground">
                    Age:
                  </Label>
                  <Input id="age" value={profile.age} onChange={(e) => handleProfileChange('age', e.target.value)} className="w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground">Role:</Label>
                  <Input
                    id="role"
                    value={currentUser.role}
                    disabled
                    className="w-28 bg-muted/50"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="competitions">My Competitions</Label>
            <Input
              id="competitions"
              value={profile.competitions}
              onChange={(e) => handleProfileChange('competitions', e.target.value)}
            />
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div>
                  <Label htmlFor="work-ons">Work-ons (from Coach)</Label>
                  <Textarea
                      id="work-ons"
                      className="mt-2 bg-muted/50"
                      placeholder="Key development areas..."
                      value={profile.workOns}
                      readOnly
                  />
              </div>
              <div>
                  <Label htmlFor="pre-match-notes">Pre-Match Notes (from Coach)</Label>
                  <Textarea
                      id="pre-match-notes"
                      className="mt-2 bg-muted/50"
                      placeholder="Team tendencies, specific plays..."
                      value={profile.preMatchNotes}
                      readOnly
                  />
              </div>
              <div>
                  <Label htmlFor="video-review">Video Review (from Coach)</Label>
                  <Textarea
                      id="video-review"
                      className="mt-2 bg-muted/50"
                      placeholder="Clips to review, focus points..."
                      value={profile.videoReview}
                      readOnly
                  />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className='space-y-1.5'>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Fitness Test Results
                </CardTitle>
                <CardDescription>
                    Your latest fitness assessment scores.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleOpenFitnessTestDialog(null)}>
                <PlusCircle className="mr-2 h-4 w-4"/> Add New
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.fitnessTests.map(test => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.test}</TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell className="text-muted-foreground">{test.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenFitnessTestDialog(test)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteFitnessTest(test.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Training Schedule
                    </CardTitle>
                    <CardDescription>
                        Your weekly schedule.
                    </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleOpenTrainingScheduleDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.trainingSchedule.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-4 group">
                    <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.date}
                            {item.location && ` - ${item.location}`}
                        </p>
                        </div>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenTrainingScheduleDialog(item)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteScheduleItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Video Library</CardTitle>
                    <CardDescription>
                        Upload and review video clips for learning and analysis.
                    </CardDescription>
                </div>
                 <Button onClick={() => handleOpenVideoClipDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Clip
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.videoClips.map((clip) => (
                        <div key={clip.id} className="border rounded-lg overflow-hidden group">
                            <div className="relative aspect-video">
                                <Image 
                                    src={clip.thumbnail} 
                                    alt={clip.title} 
                                    fill
                                    className="object-cover"
                                    data-ai-hint={clip.hint} 
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="h-12 w-12 text-white" />
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="outline" size="icon" className="h-7 w-7 bg-background/80 hover:bg-muted" onClick={() => handleOpenVideoClipDialog(clip)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteVideoClip(clip.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 bg-card">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold truncate pr-2">{clip.title}</h3>
                                    <Badge variant="secondary">{clip.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{clip.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </main>

      <FitnessTestDialog 
        isOpen={isFitnessTestDialogOpen}
        onOpenChange={setIsFitnessTestDialogOpen}
        onSave={handleSaveFitnessTest}
        test={editingFitnessTest}
      />

      <TrainingScheduleDialog
        isOpen={isTrainingScheduleDialogOpen}
        onOpenChange={setIsTrainingScheduleDialogOpen}
        onSave={handleSaveScheduleItem}
        item={editingScheduleItem}
      />

      <VideoClipDialog
        isOpen={isVideoClipDialogOpen}
        onOpenChange={setIsVideoClipDialogOpen}
        onSave={handleSaveVideoClip}
        clip={editingVideoClip}
      />
    </div>
  );
}
