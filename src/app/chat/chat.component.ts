import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CoreService } from '../core.service';
import { MessageService } from '../message.service';
import { ChatService } from '../chat.service';
import { Chat } from '../chat';
import { Message } from '../message';
import { switchMap, shareReplay } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { baseUrl } from '../../environments/base-url';
import { tokenGetter } from '../token-store';
import { cluster, addToCluster } from '../cluster-array';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: Chat;
  messages: Array<Array<Message>> = [];
  chatMessageForm: FormGroup;
  userId: number;
  routeObs: Observable<any>;
  routeSub: Subscription;
  channelSub: Subscription;
  messagesSub: Subscription;
  chatSub: Subscription;
  channel: Channel;
  clusterFunction: Function;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private coreService: CoreService,
    private chatService: ChatService,
    private messageService: MessageService,
    private cableService: ActionCableService,
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

    this.clusterFunction = (message: Message) =>
      message.user.id === this.userId;

    this.messagesSub = this.routeObs
      .pipe(switchMap(chatId => this.messageService.getMessages(chatId)))
      .subscribe(messages => {
        this.messages = cluster(messages, this.clusterFunction);
      });

    this.channelSub = this.routeObs
      .pipe(
        switchMap(chatId => {
          const cable = this.cableService.cable(`ws://${baseUrl}/cable`, {
            Authorization: tokenGetter(),
          });
          this.channel = cable.channel('ChatChannel', { chat_id: chatId });
          return this.channel.received();
        }),
      )
      .subscribe(messageString => {
        const message: Message = JSON.parse(messageString);
        this.clusterFunction(message)
          ? this.addToSent(message)
          : this.addToReceived(message);
      });

    this.chatMessageForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
    this.messagesSub.unsubscribe();
    this.channel.unsubscribe();
    this.channelSub.unsubscribe();
  }

  sendMessage() {
    if (this.chatMessageForm.valid && this.chat) {
      this.messageService
        .sendMessage(this.chat.id, this.chatMessageForm.value)
        .subscribe();
    }
  }

  private addToReceived(message: Message) {
    addToCluster(this.messages, message, prev => {
      return prev.user.id === this.userId;
    });
  }

  private addToSent(message: Message) {
    addToCluster(this.messages, message, prev => {
      return prev.user.id !== this.userId;
    });
  }
}
