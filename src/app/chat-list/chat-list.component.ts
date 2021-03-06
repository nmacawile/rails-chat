import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
  filter,
} from 'rxjs/operators';
import { CoreService } from '../core.service';
import { CableService } from '../cable.service';
import { chatListAnimation } from '../animations';
import { Presence } from '../presence';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  animations: chatListAnimation,
})
export class ChatListComponent implements OnInit, AfterViewInit, OnDestroy {
  chats: Chat[];
  users: User[];
  querySubject: BehaviorSubject<string> = new BehaviorSubject('');
  pageSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  querySubscription: Subscription;
  notificationsSubscription: Subscription;
  presenceSubscription: Subscription;
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

  ngAfterViewInit() {
    this.notificationsSubscription = this.cableService.notificationsReceived.subscribe(
      (newChat: Chat) => {
        const index =
          this.chats && this.chats.findIndex(chat => chat.id == newChat.id);
        if (index >= 0) this.chats.splice(index, 1);
        this.chats.unshift(newChat);
      },
    );

    this.presenceSubscription = this.cableService.presenceReceived
      .pipe(filter(() => !!this.chats))
      .subscribe((presence: Presence) => {
        const chat = this.chats.find(c => c.user.id == presence.id);
        if (chat) chat.user.present = presence.present;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
    this.presenceSubscription.unsubscribe();
  }

  updateQuery(query: string) {
    const escapedQuery = this.escapeRegExp(query);
    this.querySubject.next(escapedQuery);
    this.pageSubject.next(0);
  }

  private escapeRegExp(string) {
    return string
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  openChat(userId: number) {
    this.chatService
      .openChat(userId)
      .subscribe(chat => this.router.navigate(['chat', chat.id]));
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
