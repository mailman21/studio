import type { RefereeProfile } from '@/types';

export type UserRole = 'referee' | 'administrator' | 'coach';

export interface User {
  email: string;
  password?: string; // Optional for social logins
  role: UserRole;
  name: string;
}

export const users: User[] = [
  {
    email: 'referee@whistlewise.com',
    password: 'password',
    role: 'referee',
    name: 'Demo Referee',
  },
  {
    email: 'admin@whistlewise.com',
    password: 'password',
    role: 'administrator',
    name: 'Demo Admin',
  },
  {
    email: 'coach@whistlewise.com',
    password: 'password',
    role: 'coach',
    name: 'Demo Coach',
  },
];

export const refereeProfileData: Record<string, RefereeProfile> = {
  'referee@whistlewise.com': {
      age: '34',
      competitions: 'U21, Currie Cup, Varsity Cup',
      workOns: '- Maintain 5m discipline at scrum\n- Clearer communication at breakdown',
      preMatchNotes: 'Lions scrum is dominant. Cheetahs have a fast backline. Watch for early engagement at scrum time.',
      videoReview: 'Focus on breakdown decisions from last week\'s game. Review positioning on the try line.',
      developmentGoals: '1. Improve positioning at the scrum.\n2. Quicker decisions at the breakdown.',
      generalNotes: 'Feeling confident for the upcoming match. Weather forecast looks clear.',
      fitnessTests: [
          { id: '1', test: '40m Sprint', result: '5.2s', date: '2024-07-15' },
          { id: '2', test: 'Yo-Yo Test', result: 'Level 18.5', date: '2024-07-15' },
          { id: '3', test: 'Bronco Test', result: '4m 50s', date: '2024-07-01' },
      ],
      trainingSchedule: [
          { id: '1', activity: 'Strength & Conditioning', date: 'Monday, 5:00 PM', location: 'Team Gym' },
          { id: '2', activity: 'Video Review Session', date: 'Tuesday, 6:00 PM', location: 'Online' },
          { id: '3', activity: 'On-field Drills', date: 'Wednesday, 5:30 PM', location: 'Club Fields' },
          { id: '4', activity: 'Rest Day', date: 'Thursday', location: '' },
          { id: '5', activity: 'Match Prep', date: 'Friday, 6:00 PM', location: 'Clubhouse' },
      ],
      videoClips: [
          { id: 1, title: 'Breakdown Decision', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby breakdown', description: 'Reviewing a key decision at the breakdown from the last match.' },
          { id: 2, title: 'Scrum Engagement', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby scrum', description: 'Analyzing scrum setup and engagement sequence.' },
          { id: 3, title: 'Offside Line Management', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby defense', description: 'Checking positioning and management of the offside line during open play.' },
      ],
      diaryVideoClips: [
        { id: 101, title: 'Personal Clip 1', thumbnail: 'https://placehold.co/600x400.png', hint: 'rugby tackle', description: 'A tackle I want to analyze for my positioning.' },
      ]
  }
};
