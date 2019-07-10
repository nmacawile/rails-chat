import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { PaginatedUsers } from './paginated-users';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${URL}/chats/`);
  }

  getChat(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${URL}/chats/${chatId}`);
  }

  getUsers(query = '', page = 1): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`${URL}/users/`, {
      params: { q: query, page: page.toString() },
    });
  }

  openChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${URL}/chats/`, {
      user_id: userId,
    });
  }
}
