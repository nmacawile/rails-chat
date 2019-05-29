import { User } from './user';

export interface Message {
  id: number;
  content: string;
  created_at: Date;
  user: User;
}