
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
