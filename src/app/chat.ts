import { User } from './user';
import { Message } from './message';

export interface Chat {
  id: number;
  user: User;
  latest_message: Message;
}
