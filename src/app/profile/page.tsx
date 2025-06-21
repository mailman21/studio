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
import { Save, Calendar, Clock, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

export default function ProfilePage() {
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
            <Label htmlFor="work-ons" className="mt-4 block">
              Work-ons for Next Match
            </Label>
            <Textarea
              id="work-ons"
              defaultValue="- Maintain 5m discipline at scrum\n- Clearer communication at breakdown"
            />
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
      </main>
    </div>
  );
}
