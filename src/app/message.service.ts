import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedMessages } from './paginated-messages';
import { environment } from '../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessages(
    chatId: number,
    before: number = null,
  ): Observable<PaginatedMessages> {
    const params = {};
    if (before) params['before'] = before;
    return this.http
      .get<PaginatedMessages>(`${URL}/chats/${chatId}/messages`, {
        params: params,
      })
      .pipe(
        map((paginatedMessages: PaginatedMessages) => {
          let messages = paginatedMessages.messages;
          messages = messages.reverse();
          return paginatedMessages;
        }),
      );
  }

  sendMessage(chatId: number, message: { content: string }) {
    return this.http.post(`${URL}/chats/${chatId}/messages`, message);
  }
}
