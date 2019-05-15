import { User } from './user';

export interface PaginatedUsers {
  count: number;
  pages: number;
  users: User[];
}