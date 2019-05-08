import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements AfterViewInit {
  @ViewChild('messageCard', { read: ElementRef })
  messageCard: ElementRef;

  @Input('message')
  message: Message;

  @Input('scrollIntoView')
  scrollIntoView: boolean;

  ngAfterViewInit() {
    if (this.scrollIntoView)
      setTimeout(() => this.messageCard.nativeElement.scrollIntoView(), 0);
  }
}
