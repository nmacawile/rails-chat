import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { User } from '../user';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Chat[];
  users: User[];
  querySubject: BehaviorSubject<string> = new BehaviorSubject('');
  querySubscription: Subscription;

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => (this.chats = chats));
    this.querySubscription = this.querySubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query: string) => this.chatService.getUsers(query)),
      )
      .subscribe(users => (this.users = users));
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  updateUsers(query: string) {
    this.querySubject.next(query);
  }

  openChat(userId: number) {
    this.chatService
      .openChat(userId)
      .subscribe(chat => this.router.navigate([`/chat/${chat.id}`]));
  }
}
