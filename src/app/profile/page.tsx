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
import { Save, Calendar, Clock, Zap, Upload, PlayCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { useRef } from 'react';

const fitnessTests = [
  { test: '40m Sprint', result: '5.2s', date: '2024-07-15' },
  { test: 'Yo-Yo Test', result: 'Level 18.5', date: '2024-07-15' },
  { test: 'Bronco Test', result: '4m 50s', date: '2024-07-01' },
];

const trainingSchedule = [
  {
    activity: 'Strength & Conditioning',
    date: 'Monday, 5:00 PM',
    location: 'Team Gym',
  },
  {
    activity: 'Video Review Session',
    date: 'Tuesday, 6:00 PM',
    location: 'Online',
  },
  {
    activity: 'On-field Drills',
    date: 'Wednesday, 5:30 PM',
    location: 'Club Fields',
  },
  { activity: 'Rest Day', date: 'Thursday', location: '' },
  { activity: 'Match Prep', date: 'Friday, 6:00 PM', location: 'Clubhouse' },
];

const videoClips = [
  { id: 1, title: 'Breakdown Decision', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby breakdown', description: 'Reviewing a key decision at the breakdown from the last match.' },
  { id: 2, title: 'Scrum Engagement', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby scrum', description: 'Analyzing scrum setup and engagement sequence.' },
  { id: 3, title: 'Offside Line Management', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby defense', description: 'Checking positioning and management of the offside line during open play.' },
];

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this file to a storage service.
      // For this demo, we'll just log it to the console.
      console.log('Selected file:', file.name);
      alert(`File "${file.name}" selected. In a real app, this would be uploaded.`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="My Profile">
        <Button>
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
              <CardTitle className="text-3xl">Demo Referee</CardTitle>
              <CardDescription>
                Personal details and account settings.
              </CardDescription>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age" className="text-muted-foreground">
                    Age:
                  </Label>
                  <Input id="age" defaultValue="34" className="w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground">Role:</Label>
                  <Input
                    id="role"
                    defaultValue="Referee"
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
              defaultValue="U21, Currie Cup, Varsity Cup"
            />
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div>
                  <Label htmlFor="work-ons">Work-ons</Label>
                  <Textarea
                      id="work-ons"
                      className="mt-2"
                      placeholder="Key development areas..."
                      defaultValue="- Maintain 5m discipline at scrum&#x0a;- Clearer communication at breakdown"
                  />
              </div>
              <div>
                  <Label htmlFor="pre-match-notes">Pre-Match Notes</Label>
                  <Textarea
                      id="pre-match-notes"
                      className="mt-2"
                      placeholder="Team tendencies, specific plays..."
                  />
              </div>
              <div>
                  <Label htmlFor="video-review">Video Review</Label>
                  <Textarea
                      id="video-review"
                      className="mt-2"
                      placeholder="Clips to review, focus points..."
                  />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fitness Test Results
              </CardTitle>
              <CardDescription>
                Your latest fitness assessment scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fitnessTests.map(test => (
                    <TableRow key={test.test}>
                      <TableCell className="font-medium">{test.test}</TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {test.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Training Schedule
              </CardTitle>
              <CardDescription>
                Your weekly schedule. This adjusts automatically based on your
                match and appointment calendar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSchedule.map(item => (
                  <div key={item.activity} className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">{item.activity}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                        {item.location && ` - ${item.location}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Smartwatch Integration</CardTitle>
            <CardDescription>
              Connect your smartwatch to automatically track heart rate, GPS
              data, and more during matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-medium">Connect your device</h3>
                <p className="text-sm text-muted-foreground">
                  Status: Not Connected
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Video Library</CardTitle>
                <CardDescription>
                    Upload and review video clips for learning and analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Button onClick={handleUploadClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Clip
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="video/*"
                    />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoClips.map((clip) => (
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
                            </div>
                            <div className="p-4 bg-card">
                                <h3 className="font-semibold truncate">{clip.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{clip.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
