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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categorizeMatchEvent } from '@/ai/flows/categorize-match-event';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import type { MatchEvent, EventType, EventCategory } from '@/types';
import { penaltySubTypes, nonDecisionSubTypes } from '@/types';

export interface DialogState {
  isOpen: boolean;
  team?: 'A' | 'B' | null;
  type?: EventType;
}

interface EventDialogProps {
  dialogState: DialogState;
  setDialogState: (state: DialogState) => void;
  addEvent: (event: Omit<MatchEvent, 'id' | 'time'>) => void;
}

export function EventDialog({ dialogState, setDialogState, addEvent }: EventDialogProps) {
  const { isOpen, team, type } = dialogState;
  const [description, setDescription] = useState('');
  const [subType, setSubType] = useState<string | undefined>();
  const [isCategorizing, setIsCategorizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setSubType(undefined);
    }
  }, [isOpen]);

  const handleClose = () => {
    setDialogState({ isOpen: false });
  };

  const handleSubmit = () => {
    if (!type) return;
    addEvent({
      team: team || null,
      type,
      subType,
      description: description || subType || type,
    });
    handleClose();
  };
  
  const handleAiCategorize = async () => {
    if (!description) {
      toast({
        title: 'Description needed',
        description: 'Please enter a description of the event first.',
        variant: 'destructive',
      });
      return;
    }

    setIsCategorizing(true);
    try {
      const result = await categorizeMatchEvent({ eventDescription: description });
      setDescription(result.detailedDescription);
      if (type === 'Penalty' && penaltySubTypes.includes(result.category)) {
          setSubType(result.category);
      }
      if (type === 'Non-Decision' && nonDecisionSubTypes.includes(result.category)) {
          setSubType(result.category);
      }
      toast({
        title: 'AI Categorization Complete',
        description: `Event categorized as ${result.category}.`,
      });
    } catch (error) {
      console.error('AI categorization failed:', error);
      toast({
        title: 'AI Error',
        description: 'Failed to categorize the event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCategorizing(false);
    }
  };


  const subTypeOptions =
    type === 'Penalty'
      ? penaltySubTypes
      : type === 'Non-Decision'
      ? nonDecisionSubTypes
      : null;

  const needsComment = type === 'Penalty' || type === 'Error' || type === 'Non-Decision' || type === 'Comment';

  if (!isOpen || !type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Event: {type}</DialogTitle>
          <DialogDescription>
            Add details for the event. Click the magic wand for AI assistance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {subTypeOptions && (
            <div>
              <Label htmlFor="subtype">Sub-category</Label>
              <Select onValueChange={setSubType} value={subType}>
                <SelectTrigger id="subtype">
                  <SelectValue placeholder={`Select a ${type} type`} />
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

          {needsComment && (
            <div className="space-y-2">
              <Label htmlFor="description">Comment / Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the event..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button onClick={handleAiCategorize} variant="outline" disabled={isCategorizing || !description}>
            {isCategorizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Categorize
          </Button>
          <div className='flex gap-2'>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
            <Button onClick={handleSubmit}>Log Event</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
