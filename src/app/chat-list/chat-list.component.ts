import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { User } from '../user';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CoreService } from '../core.service';
import { CableService } from '../cable.service';

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
  notificationsSubscription: Subscription;
  totalUsers: number;
  queryInProgress: boolean = true;
  fetchingChats: boolean = true;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private coreService: CoreService,
    private cableService: CableService,
  ) {}

  ngOnInit() {
    this.cableService.connect();
    this.notificationsSubscription = this.cableService.notificationsReceived.subscribe(
      (newChat: Chat) => {
        const index = this.chats.findIndex(chat => chat.id == newChat.id);
        this.chats.splice(index, 1);
        this.chats.unshift(newChat);
      },
    );

    this.chatService
      .getChats()
      .pipe(tap(() => (this.fetchingChats = false)))
      .subscribe(chats => (this.chats = chats));
    this.querySubscription = combineLatest(this.pageSubject, this.querySubject)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => (this.queryInProgress = true)),
        switchMap(([page, query]) =>
          this.chatService.getUsers(query, page + 1),
        ),
        tap(() => (this.queryInProgress = false)),
      )
      .subscribe(data => {
        this.users = data.users;
        this.totalUsers = data.count;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
  }

  updateQuery(query: string) {
    const squishedQuery = query.replace(/\s+/g, ' ').trim();
    this.querySubject.next(squishedQuery);
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

  highlightMatches(name, q) {
    if (q === '') return name;
    return name.replace(
      new RegExp(q, 'ig'),
      match => `<span class="highlight">${match}</span>`,
    );
  }
}
