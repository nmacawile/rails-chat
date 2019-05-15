import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { User } from '../user';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
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
  pageSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  querySubscription: Subscription;
  totalUsers: number;

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => (this.chats = chats));
    this.querySubscription = combineLatest(this.pageSubject, this.querySubject)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(([page, query]) =>
          this.chatService.getUsers(query, page + 1),
        ),
      )
      .subscribe(data => {
        this.users = data.users;
        this.totalUsers = data.count;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  updateQuery(query: string) {
    this.querySubject.next(query);
    this.pageSubject.next(0);
  }

  openChat(userId: number) {
    this.chatService
      .openChat(userId)
      .subscribe(chat => this.router.navigate([`/chat/${chat.id}`]));
  }

  changePage(event) {
    this.pageSubject.next(event.pageIndex);
  }
}
