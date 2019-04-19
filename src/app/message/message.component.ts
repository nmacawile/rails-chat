import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ScrollPositionService } from '../scroll-position.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild('messageCard', { read: ElementRef })
  messageCard: ElementRef;

  constructor(private scrollPositionService: ScrollPositionService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.scrollPositionService.scrolledToBottom)
      this.messageCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
