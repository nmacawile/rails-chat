import { Component, OnInit } from '@angular/core';

interface Chat {
  id: number,
}

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chats: Chat[] = [];

  constructor() {}

  ngOnInit() {
    for (var i = 0; i < 10; i++) {
      const chat: Chat = { id: i };
      this.chats.push(chat);
    }
  }
}
