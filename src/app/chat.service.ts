import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../environments/base-url';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`https://${baseUrl}/chats/`);
  }

  getChat(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`https://${baseUrl}/chats/${chatId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`https://${baseUrl}/users/`);
  }

  openChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`https://${baseUrl}/chats/`, {
      user_id: userId,
    });
  }
}
