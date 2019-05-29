import { Injectable } from '@angular/core';
import { ActionCableService, Cable, Channel } from 'angular2-actioncable';
import { baseUrl } from '../environments/base-url';
import { tokenGetter, userGetter } from './token-store';
import { map, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Message } from './message';
import { Chat } from './chat';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from './user';

const CABLE_URL = `ws://${baseUrl}/cable`;

@Injectable({
  providedIn: 'root',
})
export class CableService {
  cable: Cable;
  notificationsChannel: Channel;
  notificationsReceived: Observable<Chat>;
  notificationsSub: Subscription;
  presenceChannel: Channel;

  constructor(
    private actionCableService: ActionCableService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  connect() {
    if (!this.cable) {
      this.cable = this.actionCableService.cable(CABLE_URL, {
        Authorization: tokenGetter(),
      });

      this.notificationsChannel = this.cable.channel('NotificationsChannel');
      this.notificationsReceived = this.notificationsChannel
        .received()
        .pipe(map((chatData: string) => JSON.parse(chatData)));
      this.notificationsSub = this.notificationsReceived
        .pipe(
          filter(
            (chat: Chat) => chat.latest_message.user.id != userGetter().id,
          ),
        )
        .subscribe((chat: Chat) => this.openSnackBar(chat));

      this.presenceChannel = this.cable.channel('PresenceChannel');
    }
  }

  disconnect() {
    this.notificationsChannel.unsubscribe();
    this.presenceChannel.unsubscribe();
    this.actionCableService.disconnect(CABLE_URL);
    this.notificationsSub.unsubscribe();
    this.cable = null;
  }

  chatRoom(chatId: number): Channel {
    return this.cable.channel('ChatChannel', { chat_id: chatId });
  }

  private openSnackBar(chat: Chat) {
    const snackbar = this.snackBar.open(
      `${chat.latest_message.user.name}: ${chat.latest_message.content}`,
      'VIEW',
      {
        duration: 1500,
        verticalPosition: 'top',
      },
    );
    snackbar
      .onAction()
      .subscribe(() => this.router.navigate(['chat', chat.id]));
  }
}
