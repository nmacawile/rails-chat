import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { User } from '../user';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chats: Chat[];
  users: User[];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => (this.chats = chats));
    this.chatService.getUsers().subscribe(users => (this.users = users));
  }

  openChat(userId: number) {
    this.chatService
      .openChat(userId)
      .subscribe(chat => this.router.navigate([`/chat/${chat.id}`]));
  }
}
