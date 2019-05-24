import { Injectable } from '@angular/core';
import { ActionCableService, Cable, Channel } from 'angular2-actioncable';
import { baseUrl } from '../environments/base-url';
import { tokenGetter } from './token-store';

const CABLE_URL = `ws://${baseUrl}/cable`;

@Injectable({
  providedIn: 'root',
})
export class CableService {
  cable: Cable;

  constructor(private actionCableService: ActionCableService) {}

  connect() {
    this.cable = this.actionCableService.cable(CABLE_URL, {
      Authorization: tokenGetter(),
    });
  }

  disconnect() {
    this.actionCableService.disconnect(CABLE_URL);
  }

  join(chatId: number): Channel {
    return this.cable.channel('ChatChannel', { chat_id: chatId });
  }
}
