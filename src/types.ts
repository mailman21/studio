export type EventCategory = 'Penalty' | 'Error' | 'Non-Decision';
export type EventType = EventCategory | 'Scrum' | 'Free-Kick' | 'Positive HID' | 'Comment' | 'Lineout' | 'L2M';

export interface MatchEvent {
  id: string;
  time: number;
  team: 'A' | 'B' | null;
  type: EventType;
  subType?: string;
  description: string;
}

export interface PastMatch {
    id: number;
    date: string;
    teams: string;
    competition: string;
    venue: string;
    result: string;
    events: MatchEvent[];
    teamAName: string;
    teamBName: string;
    coachRating?: number;
    coachReportUrl?: string;
}

export const penaltySubTypes = ['Offside', 'Breakdown', 'Scrum', 'Lineout', 'L2m', 'Foul Play'];
export const nonDecisionSubTypes = ['Offside', 'ND', 'Error', 'Foul Play', 'Scrum', 'L2M', 'General play'];

export const matchesData: PastMatch[] = [
    { 
        id: 1, 
        date: '2024-07-20', 
        teams: 'Cheetahs vs Lions',
        teamAName: 'Cheetahs',
        teamBName: 'Lions',
        competition: 'U21', 
        venue: 'Emirates Airline Park',
        result: '3-15',
        events: [
            { id: '1a', time: 300, team: 'A', type: 'Penalty', subType: 'Offside', description: 'Cheetahs offside at the ruck' },
            { id: '1b', time: 650, team: 'B', type: 'Scrum', description: 'Scrum to Lions' },
            { id: '1c', time: 920, team: 'B', type: 'Penalty', subType: 'Foul Play', description: 'Lions high tackle' },
        ],
        coachRating: 85,
    },
    { 
        id: 2, 
        date: '2024-07-13', 
        teams: 'Bulls vs Sharks',
        teamAName: 'Bulls',
        teamBName: 'Sharks',
        competition: 'Currie Cup', 
        venue: 'Loftus Versfeld',
        result: '24-21',
        events: [
            { id: '2a', time: 120, team: 'A', type: 'Error', description: 'Referee communication error' },
            { id: '2b', time: 800, team: 'B', type: 'Free-Kick', description: 'Free-kick to Sharks' },
            { id: '2c', time: 1500, team: 'A', type: 'Penalty', subType: 'Breakdown', description: 'Bulls holding on' },
            { id: '2d', time: 2100, team: null, type: 'Comment', description: 'Water break' },
        ],
        coachRating: 78,
        coachReportUrl: '/reports/match-2-report.pdf'
    },
    { 
        id: 3, 
        date: '2024-07-27', 
        teams: 'Stormers vs Leinster',
        teamAName: 'Stormers',
        teamBName: 'Leinster',
        competition: 'URC Final', 
        venue: 'DHL Stadium',
        result: '31-28',
        events: [
            { id: '3a', time: 180, team: 'A', type: 'Penalty', subType: 'Breakdown', description: 'Stormers holding on at the breakdown' },
            { id: '3b', time: 420, team: 'B', type: 'Scrum', description: 'Scrum awarded to Leinster' },
            { id: '3c', time: 750, team: 'B', type: 'Penalty', subType: 'Foul Play', description: 'High tackle by Leinster player' },
            { id: '3d', time: 900, team: 'A', type: 'Free-Kick', description: 'Free-kick for Stormers at scrum' },
            { id: '3e', time: 1230, team: null, type: 'Scrum', subType: 'Reset', description: 'Scrum reset' },
            { id: '3f', time: 1500, team: 'A', type: 'Penalty', subType: 'Offside', description: 'Stormers defensive line offside' },
            { id: '3g', time: 1800, team: null, type: 'Comment', description: 'Official water break' },
            { id: '3h', time: 2100, team: null, type: 'Error', description: 'Referee communication error with TMO' },
            { id: '3i', time: 2350, team: 'B', type: 'Penalty', subType: 'Breakdown', description: 'Leinster player not rolling away' },
            { id: '3j', time: 2400, team: null, type: 'Comment', description: 'Half Time' },
            { id: '3k', time: 2520, team: 'A', type: 'Scrum', description: 'Scrum to Stormers to start second half' },
            { id: '3l', time: 2880, team: 'A', type: 'Penalty', subType: 'Lineout', description: 'Incorrect lineout throw by Stormers' },
            { id: '3m', time: 3100, team: 'B', type: 'Non-Decision', subType: 'Foul Play', description: 'Potential foul play by Leinster, TMO review, no action taken' },
            { id: '3n', time: 3600, team: 'A', type: 'Positive HID', description: 'Great advantage played by referee for Stormers' },
            { id: '3o', time: 3900, team: 'B', type: 'Penalty', subType: 'Scrum', description: 'Leinster scrum collapse' },
            { id: '3p', time: 4200, team: null, type: 'Scrum', subType: 'Reset', description: 'Another scrum reset' },
            { id: '3q', time: 4500, team: 'A', type: 'Penalty', subType: 'Foul Play', description: 'Dangerous tackle by Stormers' },
            { id: '3r', time: 4780, team: null, type: 'Error', description: 'Timekeeping error, corrected on screen' },
            { id: '3s', time: 4800, team: null, type: 'Comment', description: 'Full Time' },
        ],
        coachRating: 92,
    },
];
