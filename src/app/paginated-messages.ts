import { Message } from './message';

export interface PaginatedMessages {
  count: number;
  pages: number;
  messages: Message[];
}