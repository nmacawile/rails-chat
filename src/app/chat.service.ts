import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { PaginatedUsers } from './paginated-users';

const BASE_PATH = `https://${environment.baseUrl}`;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${BASE_PATH}/chats/`);
  }

  getChat(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${BASE_PATH}/chats/${chatId}`);
  }

  getUsers(query = '', page = 1): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`${BASE_PATH}/users/`, {
      params: { q: query, page: page.toString() },
    });
  }

  openChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${BASE_PATH}/chats/`, {
      user_id: userId,
    });
  }
}
