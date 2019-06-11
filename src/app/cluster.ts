import { Message } from './message';

export interface Cluster {
  userId: number;
  messages: Message[];
}