import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Chat } from '../chat';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chats: Chat[];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => (this.chats = chats));
  }
}
