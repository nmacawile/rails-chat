import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from './message';
import { baseUrl } from '../environments/base-url';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessages(chatId: number): Observable<Message[]> {
    return this.http
      .get<Message[]>(`https://${baseUrl}/chats/${chatId}/messages`)
      .pipe(map((messages: Message[]) => messages.reverse()));
  }

  sendMessage(chatId: number, message: { content: string }) {
    return this.http.post(
      `https://${baseUrl}/chats/${chatId}/messages`,
      message,
    );
  }
}
