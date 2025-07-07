'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MatchEvent, EventType } from '@/types';
import { penaltySubTypes, nonDecisionSubTypes } from '@/types';

// More flexible event type for the dialog
export type DialogEvent = Omit<MatchEvent, 'subType'> & { subType?: string };

interface EditEventDialogProps {
  dialogState: {
    isOpen: boolean;
    event?: DialogEvent;
  };
  setDialogState: (state: { isOpen: boolean; event?: DialogEvent }) => void;
  onSave: (event: DialogEvent) => void;
  teamAName: string;
  teamBName: string;
}

export function EditEventDialog({ dialogState, setDialogState, onSave, teamAName, teamBName }: EditEventDialogProps) {
  const { isOpen, event } = dialogState;
  const [formData, setFormData] = useState<DialogEvent | undefined>(event);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleClose = () => {
    setDialogState({ isOpen: false });
  };

  const handleChange = (field: keyof DialogEvent, value: any) => {
    if (formData) {
        if (field === 'time') {
            const [minutes, seconds] = String(value).split(':').map(Number);
            const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
            setFormData({ ...formData, time: totalSeconds });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    }
  };
  
  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
    handleClose();
  };

  const formatTime = (totalSeconds: number) => {
    if (isNaN(totalSeconds)) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (!isOpen || !formData) return null;

  const allEventTypes: EventType[] = ['Penalty', 'Error', 'Non-Decision', 'Scrum', 'Free-Kick', 'Positive HID', 'Comment', 'Lineout', 'L2M', 'HID'];
  const subTypeOptions =
    formData.type === 'Penalty'
      ? penaltySubTypes
      : formData.type === 'Non-Decision'
      ? nonDecisionSubTypes
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{event?.id.startsWith('new-') ? 'Add New Event' : 'Edit Event'}</DialogTitle>
          <DialogDescription>
            Modify the details of the match event below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Time</Label>
            <Input
              id="time"
              value={formatTime(formData.time)}
              onChange={(e) => handleChange('time', e.target.value)}
              className="col-span-3"
              placeholder="mm:ss"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">Team</Label>
            <Select onValueChange={(value) => handleChange('team', value === 'null' ? null : value)} value={formData.team ?? 'null'}>
              <SelectTrigger id="team" className="col-span-3">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{teamAName}</SelectItem>
                <SelectItem value="B">{teamBName}</SelectItem>
                <SelectItem value="null">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(value) => handleChange('type', value as EventType)} value={formData.type}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                {allEventTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {subTypeOptions && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subtype" className="text-right">Sub-Type</Label>
              <Select onValueChange={(value) => handleChange('subType', value)} value={formData.subType}>
                <SelectTrigger id="subtype" className="col-span-3">
                  <SelectValue placeholder={`Select a ${formData.type} type`} />
                </SelectTrigger>
                <SelectContent>
                  {subTypeOptions.map(st => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
