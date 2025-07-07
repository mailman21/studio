export type EventCategory = 'Penalty' | 'Error' | 'Non-Decision';
export type EventType = EventCategory | 'Scrum' | 'Free-Kick' | 'Positive HID' | 'Comment' | 'Lineout' | 'L2M' | 'HID';

export interface MatchEvent {
  id: string;
  time: number;
  team: 'A' | 'B' | null;
  type: EventType;
  subType?: string;
  description: string;
}

export interface GpsPoint {
  time: number; // in seconds, matches event time
  heartRate: number; // bpm
  speed: number; // m/s
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
    gpsData?: GpsPoint[];
}

export const penaltySubTypes = ['Offside', 'Breakdown', 'Scrum', 'Lineout', 'L2m', 'Foul Play'];
export const nonDecisionSubTypes = ['Offside', 'ND', 'Error', 'Foul Play', 'Scrum', 'L2M', 'General play'];

export type FitnessTest = { id: string; test: string; result: string; date: string };
export type ScheduleItem = { id: string; activity: string; date: string; location: string };

export const videoClipCategories = ['Match Prep', 'Coach Analysis', 'Personal Review', 'Skills Drill'] as const;
export type VideoClipCategory = typeof videoClipCategories[number];

export type VideoClip = { 
    id: number; 
    title: string; 
    thumbnail: string; 
    hint: string, 
    description: string;
    category: VideoClipCategory;
};

export interface RefereeProfile {
    age: string;
    competitions: string;
    workOns: string;
    preMatchNotes: string;
    videoReview: string;
    fitnessTests: FitnessTest[];
    trainingSchedule: ScheduleItem[];
    videoClips: VideoClip[];
    developmentGoals: string;
    diaryVideoClips: VideoClip[];
    generalNotes: string;
}

const generateGpsData = (durationInSeconds: number, points: number): GpsPoint[] => {
    const data: GpsPoint[] = [];
    let lastHeartRate = 120;
    for (let i = 0; i < points; i++) {
        const time = Math.floor((i / points) * durationInSeconds);
        
        lastHeartRate += (Math.random() - 0.48) * 10;
        lastHeartRate = Math.max(110, Math.min(185, lastHeartRate)); 
        
        const speed = time % 300 < 50 ? Math.random() * 2 + 5 : Math.random() * 4;

        data.push({
            time,
            heartRate: Math.round(lastHeartRate),
            speed: parseFloat(speed.toFixed(2)),
        });
    }
    return data;
};


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
        gpsData: generateGpsData(4800, 100),
    },
    { 
        id: 4, 
        date: '2024-08-03', 
        teams: 'Western Province vs Blue Bulls',
        teamAName: 'Western Province',
        teamBName: 'Blue Bulls',
        competition: 'Currie Cup Final', 
        venue: 'Cape Town Stadium',
        result: '28-25',
        events: [
            { id: '4a', time: 1, team: null, type: 'Comment', description: 'Kick-off for the Currie Cup Final.' },
            { id: '4b', time: 240, team: 'A', type: 'Penalty', subType: 'Breakdown', description: 'WP not rolling away.' },
            { id: '4c', time: 550, team: 'B', type: 'Scrum', description: 'Scrum to Bulls, knock on by WP.' },
            { id: '4d', time: 780, team: 'A', type: 'Penalty', subType: 'Offside', description: 'WP defensive line creeps up early.' },
            { id: '4e', time: 910, team: null, type: 'Comment', description: 'Good attacking phase from the Bulls.' },
            { id: '4f', time: 1120, team: 'B', type: 'Error', description: 'Missed a clear forward pass by the Bulls.' },
            { id: '4g', time: 1350, team: 'A', type: 'Positive HID', description: 'Excellent advantage played for WP, leading to a break.' },
            { id: '4h', time: 1600, team: 'B', type: 'Lineout', description: 'Lineout to the Bulls on the 22m line.' },
            { id: '4i', time: 1830, team: 'B', type: 'Non-Decision', subType: 'Foul Play', description: 'TMO check for a high tackle from Bulls, decided it was legal.' },
            { id: '4j', time: 2100, team: 'A', type: 'Free-Kick', description: 'Free kick to WP for early engagement.' },
            { id: '4k', time: 2390, team: 'B', type: 'Penalty', subType: 'L2m', description: 'Bulls player deliberately slowing the ball down.' },
            { id: '4l', time: 2400, team: null, type: 'Comment', description: 'Half Time. Score: WP 14 - 10 Bulls' },
            { id: '4m', time: 2401, team: null, type: 'Comment', description: 'Second half underway.' },
            { id: '4n', time: 2700, team: 'A', type: 'Scrum', subType: 'Reset', description: 'Scrum reset due to instability.' },
            { id: '4o', time: 2730, team: 'A', type: 'Penalty', subType: 'Scrum', description: 'WP scrum collapse.' },
            { id: '4p', time: 3100, team: 'A', type: 'Lineout', description: 'WP lineout on their own 10m line.' },
            { id: '4q', time: 3350, team: 'B', type: 'Penalty', subType: 'Foul Play', description: 'Dangerous cleanout by Bulls player, yellow card issued.' },
            { id: '4r', time: 3600, team: null, type: 'Comment', description: 'Intense period with Bulls down to 14 men.' },
            { id: '4s', time: 3950, team: 'A', 'type': 'Penalty', 'subType': 'Breakdown', 'description': 'WP penalized for going off their feet.' },
            { id: '4t', time: 4200, team: 'B', type: 'Non-Decision', subType: 'ND', description: 'Advantage over, play on after a knock-on.' },
            { id: '4u', time: 4500, team: 'A', type: 'Positive HID', description: 'Good call on a tricky grounding for a try.' },
            { id: '4v', time: 4750, team: 'B', type: 'Penalty', subType: 'Offside', description: 'Game-winning penalty chance for Bulls, WP offside.' },
            { id: '4w', time: 4800, team: null, type: 'Comment', description: 'Full Time. Final Score: WP 28 - 25 Bulls' },
        ],
        coachRating: 88,
        coachReportUrl: '/reports/match-4-report.pdf',
        gpsData: generateGpsData(4800, 150),
    },
];

export interface UpcomingMatch {
  id: number;
  date: string;
  teams: string;
  competition: string;
  location: string;
  notes?: string;
  prepDocUrl?: string;
}

export const upcomingMatchesData: UpcomingMatch[] = [
  {
    id: 1,
    date: '2024-08-10',
    teams: 'Sharks vs Bulls',
    competition: 'Currie Cup',
    location: 'Kings Park, Durban',
    notes: 'Expecting a fast-paced game. Focus on breakdown accuracy.',
  },
  {
    id: 2,
    date: '2024-08-17',
    teams: 'Lions vs Stormers',
    competition: 'Currie Cup',
    location: 'Emirates Airline Park, Johannesburg',
    notes: 'Lions have a strong scrum. Need to manage the engagement sequence carefully.',
  },
  {
    id: 3,
    date: '2024-08-24',
    teams: 'Griquas vs Pumas',
    competition: 'Currie Cup',
    location: 'Griqua Park, Kimberley',
  },
];
