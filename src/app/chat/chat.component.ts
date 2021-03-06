import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { MessageService } from '../message.service';
import { ChatService } from '../chat.service';
import { Chat } from '../chat';
import { Message } from '../message';
import { tap, map, filter, finalize } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { CableService } from '../cable.service';
import {
  createClusters,
  addIntoClusters,
  combineClusters,
} from '../cluster-operators';
import { Channel } from 'angular2-actioncable';
import { Cluster } from '../cluster';
import { PaginatedMessages } from '../paginated-messages';
import { Presence } from '../presence';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: Chat;
  messageClusters: Cluster[];
  pages = 0;
  loading: boolean = false;
  sendingMessage: boolean = false;

  chatMessageForm: FormGroup;
  userId: number;
  routeSub: Subscription;
  chatRoom: Channel;
  chatRoomSub: Subscription;
  scrolledToBottom: boolean = true;
  presenceSub: Subscription;

  chatId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private coreService: CoreService,
    private chatService: ChatService,
    private messageService: MessageService,
    private cableService: CableService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.chatMessageForm = this.fb.group({
      content: ['', Validators.maxLength(2000)],
    });

    this.userId = this.coreService.currentUser.id;
    this.chatId = +this.route.snapshot.paramMap.get('id');

    this.chatService
      .getChat(this.chatId)
      .subscribe(chat => (this.chat = chat), () => this.router.navigate(['/']));

    this.messageService
      .getMessages(this.chatId)
      .subscribe((paginatedMessages: PaginatedMessages) => {
        this.messageClusters = createClusters(paginatedMessages.messages);
        this.pages = paginatedMessages.pages;
      });

    this.chatRoom = this.cableService.chatRoom(this.chatId);
    this.chatRoomSub = this.chatRoom
      .received()
      .pipe(map((messageData: string) => JSON.parse(messageData)))
      .subscribe((message: Message) => {
        addIntoClusters(this.messageClusters, message);
      });

    this.presenceSub = this.cableService.presenceReceived
      .pipe(
        filter(
          (presence: Presence) => this.chat && presence.id == this.chat.user.id,
        ),
      )
      .subscribe((presence: Presence) => {
        this.chat.user.present = presence.present;
      });
  }

  ngOnDestroy() {
    this.chatRoom.unsubscribe();
    this.chatRoomSub.unsubscribe();
    this.presenceSub.unsubscribe();
  }

  updateScroll(event: Event) {
    const scrollable: Element = <Element>event.target;

    this.scrolledToBottom =
      Math.abs(
        scrollable.scrollHeight -
          (scrollable.scrollTop + scrollable.clientHeight),
      ) < 100;
  }

  sendMessage() {
    const content = this.chatMessageForm.get('content').value;
    const trimmed = content && content.trim();
    if (
      trimmed &&
      this.chat &&
      this.chatMessageForm.valid &&
      !this.sendingMessage
    ) {
      this.sendingMessage = true;
      this.messageService
        .sendMessage(this.chat.id, { content: trimmed })
        .pipe(finalize(() => (this.sendingMessage = false)))
        .subscribe(() => {
          this.chatMessageForm.reset();
        });
    }
  }

  loadOlderMessages() {
    const scrollable: Element = document.getElementById('chat-messages');

    const sH = scrollable.scrollHeight;
    const sT = scrollable.scrollTop;

    this.loading = true;

    const messageId = this.messageClusters[0].messages[0].id;

    this.messageService
      .getMessages(this.chatId, messageId)
      .pipe(
        finalize(() => {
          this.loading = false;
          setTimeout(() => {
            scrollable.scrollTop = scrollable.scrollHeight - sH + sT;
          }, 0);
        }),
      )
      .subscribe((paginatedOldMessages: PaginatedMessages) => {
        if (paginatedOldMessages.messages.length > 0) {
          const oldMessageClusters = createClusters(
            paginatedOldMessages.messages,
          );
          this.messageClusters = combineClusters(
            oldMessageClusters,
            this.messageClusters,
          );
        }
        this.pages = paginatedOldMessages.pages;
      });
  }
}
