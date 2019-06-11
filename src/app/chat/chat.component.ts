import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { CoreService } from '../core.service';
import { MessageService } from '../message.service';
import { ChatService } from '../chat.service';
import { Chat } from '../chat';
import { Message } from '../message';
import { switchMap, shareReplay, map, filter, take } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { CableService } from '../cable.service';
import {
  createClusters,
  addIntoClusters,
  combineClusters,
} from '../cluster-operators';
import { Channel } from 'angular2-actioncable';
import { Cluster } from '../cluster';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  chat: Chat;
  messageClusters: Cluster[];

  chatMessageForm: FormGroup;
  userId: number;
  routeObs: Observable<any>;
  routeSub: Subscription;
  chatRoom: Channel;
  chatRoomSub: Subscription;
  messagesSub: Subscription;
  chatSub: Subscription;
  scrolledToBottom: boolean = true;
  presenceSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private coreService: CoreService,
    private chatService: ChatService,
    private messageService: MessageService,
    private cableService: CableService,
  ) {}

  ngOnInit() {
    this.userId = this.coreService.currentUser.id;

    this.routeObs = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return of(+params.get('id'));
      }),
      shareReplay(),
    );

    this.chatSub = this.routeObs
      .pipe(switchMap(chatId => this.chatService.getChat(chatId)))
      .subscribe(chat => (this.chat = chat));

    this.messagesSub = this.routeObs
      .pipe(switchMap(chatId => this.messageService.getMessages(chatId)))
      .subscribe(messages => {
        this.messageClusters = createClusters(messages);
      });

    this.chatRoomSub = this.routeObs
      .pipe(
        switchMap(chatId => {
          this.chatRoom = this.cableService.chatRoom(chatId);
          return this.chatRoom.received();
        }),
        map((messageData: string) => JSON.parse(messageData)),
      )
      .subscribe((message: Message) => {
        addIntoClusters(this.messageClusters, message);
      });

    this.chatMessageForm = this.fb.group({
      content: '',
    });
  }

  ngAfterViewInit() {
    this.presenceSub = this.cableService.presenceChannel
      .received()
      .pipe(
        filter(
          (presence: { id: number; present: boolean }) =>
            this.chat && presence.id == this.chat.user.id,
        ),
      )
      .subscribe((presence: { id: number; present: boolean }) => {
        if (this.chat) this.chat.user.present = presence.present;
      });
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
    this.messagesSub.unsubscribe();
    this.chatRoom.unsubscribe();
    this.chatRoomSub.unsubscribe();
    this.presenceSub.unsubscribe();
  }

  updateScroll(event: Event) {
    const scrollable: Element = <Element>event.target;
    if (scrollable.scrollTop === 0) this.loadOlderMessages();

    this.scrolledToBottom =
      Math.abs(
        scrollable.scrollHeight -
          (scrollable.scrollTop + scrollable.clientHeight),
      ) < 100;
  }

  sendMessage() {
    const content = this.chatMessageForm.get('content').value;
    const trimmed = content && content.trim();
    if (trimmed && this.chat) {
      this.messageService
        .sendMessage(this.chat.id, { content: trimmed })
        .subscribe();
    }
  }

  loadOlderMessages() {
    this.routeObs
      .pipe(
        switchMap((chatId: number) => {
          return this.messageService.getMessages(
            chatId,
            this.messageClusters[0].messages[0].id,
          );
        }),
        take(1),
      )
      .subscribe((oldMessages: Message[]) => {
        if (oldMessages.length > 0) {
          const oldMessageClusters = createClusters(oldMessages);
          this.messageClusters = combineClusters(
            oldMessageClusters,
            this.messageClusters,
          );
        }
      });
  }
}
