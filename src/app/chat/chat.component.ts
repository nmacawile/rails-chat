import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreService } from '../core.service';
import { MessageService } from '../message.service';
import { ChatService } from '../chat.service';
import { Chat } from '../chat';
import { Message } from '../message';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private coreService: CoreService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.userId = this.coreService.currentUser.id;
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.chatService.getChat(+params.get('id')),
        ),
        switchMap((chat: Chat) => {
          this.chat = chat;
          return this.messageService.getMessages(chat.id);
        }),
      )
      .subscribe(messages => {
        this.clusterMessages(messages);
      });

    this.chatMessageForm = this.fb.group({ message: '' });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private clusterMessages(messages) {
    messages.forEach((message: Message) => {
      if (message.user.id === this.userId) this.addToSent(message);
      else this.addToReceived(message);
    });
  }

  private addToReceived(message: Message) {
    if (
      this.messages.length === 0 ||
      this.last_element(this.messages).user.id === this.userId
    )
      this.messages.push([message]);
    else this.last(this.messages).push(message);
  }

  private addToSent(message: Message) {
    if (
      this.messages.length === 0 ||
      this.last_element(this.messages).user.id !== this.userId
    )
      this.messages.push([message]);
    else this.last(this.messages).push(message);
  }

  private last(array: Array<any>) {
    return array[array.length - 1];
  }

  private last_element(array: Array<Array<any>>) {
    return this.last(this.last(array));
  }
}
