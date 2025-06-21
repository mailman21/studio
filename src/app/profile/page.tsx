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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Referee" data-ai-hint="person portrait" />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">Demo Referee</CardTitle>
              <CardDescription>
                Your personal and professional details.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" defaultValue="34" />
              </div>
              <div>
                <Label htmlFor="competitions">Competitions</Label>
                <Input
                  id="competitions"
                  defaultValue="U21, Currie Cup"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Smart Watch Connected</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow tracking of heart rate and GPS data.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
                <Label>Coach's Score / Rating</Label>
                <Input id="coach-rating" defaultValue="8.5 / 10" />
                <Label>Work-ons for Next Match</Label>
                <Textarea id="work-ons" defaultValue="- Maintain 5m discipline at scrum\n- Clearer communication at breakdown" />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Coaching Reports</CardTitle>
              <CardDescription>Upload and review reports from your coach.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Report
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Self Reviews</CardTitle>
              <CardDescription>Upload and manage your self-review documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Review
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Match Timeline</CardTitle>
            <CardDescription>A record of the matches you have refereed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Cheetahs vs Lions (U21) - July 20, 2024</p>
            <Separator />
            <p className="text-sm text-muted-foreground">Bulls vs Sharks (Currie Cup) - July 13, 2024</p>
            <Separator />
             <p className="text-sm text-muted-foreground">Western Province vs Griquas (Currie Cup) - July 6, 2024</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
