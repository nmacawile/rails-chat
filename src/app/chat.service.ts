import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../environments/base-url';
import { Observable } from 'rxjs';
import { Chat } from './chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`https://${baseUrl}/chats/`);
  }
}
