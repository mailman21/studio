'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UpcomingMatch } from '@/types';

type NewMatchDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (match: Omit<UpcomingMatch, 'id' | 'notes'>) => void;
};

export function NewMatchDialog({ isOpen, onOpenChange, onSave }: NewMatchDialogProps) {
  const [formData, setFormData] = useState({
    date: '',
    teams: '',
    competition: '',
    location: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when dialog opens
      setFormData({
        date: new Date().toISOString().split('T')[0],
        teams: '',
        competition: '',
        location: '',
      });
    }
  }, [isOpen]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const isFormValid = formData.teams && formData.competition && formData.location && formData.date;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Upcoming Match</DialogTitle>
          <DialogDescription>
            Enter the details for the new fixture you need to plan for.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="teams">Teams</Label>
            <Input id="teams" value={formData.teams} onChange={e => handleChange('teams', e.target.value)} placeholder="e.g., Team A vs Team B" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="competition">Competition</Label>
            <Input id="competition" value={formData.competition} onChange={e => handleChange('competition', e.target.value)} placeholder="e.g., Varsity Cup" />
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g., City Stadium" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} />
            </div>
           </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSave} disabled={!isFormValid}>Add Match</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
