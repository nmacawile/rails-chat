import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild('messageCard', { read: ElementRef })
  messageCard: ElementRef;

  @Input('scrollIntoView')
  scrollIntoView: boolean;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.scrollIntoView)
      this.messageCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
