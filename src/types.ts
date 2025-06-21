export type EventCategory = 'Penalty' | 'Error' | 'Non-Decision';
export type EventType = EventCategory | 'Scrum' | 'Free-Kick' | 'Positive HID' | 'Comment';

export interface MatchEvent {
  id: string;
  time: number;
  team: 'A' | 'B' | null;
  type: EventType;
  subType?: string;
  description: string;
}

export const penaltySubTypes = ['Offside', 'Breakdown', 'Scrum', 'Lineout', 'L2m', 'Foul Play'];
export const nonDecisionSubTypes = ['Offside', 'ND', 'Error', 'Foul Play', 'Scrum', 'L2M', 'General play'];
