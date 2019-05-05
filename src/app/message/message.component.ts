import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { ScrollPositionService } from '../scroll-position.service';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild('messageCard', { read: ElementRef })
  messageCard: ElementRef;

  @Input('message') message: Message;

  constructor(private scrollPositionService: ScrollPositionService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.scrollPositionService.scrolledToBottom)
      this.messageCard.nativeElement.scrollIntoView();
  }
}
