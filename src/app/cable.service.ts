import { Injectable } from '@angular/core';
import { ActionCableService, Cable, Channel } from 'angular2-actioncable';
import { baseUrl } from '../environments/base-url';
import { tokenGetter } from './token-store';
import { map, filter, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Message } from './message';
import { MatSnackBar } from '@angular/material';
import { userGetter } from './token-store';

const CABLE_URL = `ws://${baseUrl}/cable`;

@Injectable({
  providedIn: 'root',
})
export class CableService {
  cable: Cable;
  chatChannel: Channel;
  notificationsSub: Subscription;

  constructor(
    private actionCableService: ActionCableService,
    private snackBar: MatSnackBar,
  ) {}

  connect() {
    if (!this.cable) {
      this.cable = this.actionCableService.cable(CABLE_URL, {
        Authorization: tokenGetter(),
      });
      this.chatChannel = this.cable.channel('ChatChannel');
      this.notificationsSub = this.chatNotifications().subscribe();
    }
  }

  disconnect() {
    this.chatChannel.unsubscribe();
    this.actionCableService.disconnect(CABLE_URL);
    this.notificationsSub.unsubscribe();
    this.cable = null;
  }

  chatRoom(chatId: number): Observable<Message> {
    return this.chatChannelReceived().pipe(
      filter((message: Message) => message['chat_id'] == chatId),
    );
  }

  private chatNotifications() {
    return this.chatChannelReceived().pipe(
      filter((message: Message) => message.user.id != userGetter().id),
      tap((message: Message) => this.openSnackBar(message)),
    );
  }

  private chatChannelReceived() {
    return this.chatChannel.received().pipe(
      map((messageData: string) => JSON.parse(messageData)),
    );
  }

  private openSnackBar(message: Message) {
    this.snackBar.open(
      `${message.user.name}: ${message.content.substring(0, 50)}`,
      'CLOSE',
      {
        duration: 5000,
        verticalPosition: 'top',
      },
    );
  }
}
