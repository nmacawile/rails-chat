import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,

} from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { scrollPositionFromBottom } from '../helper';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  list: Array<Array<number>> = [];

  scrolledToBottom: boolean = true;
  scrollSubscription: Subscription;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const scrollableElement = document.querySelector('.mat-drawer-content');
    const scrollObservable = fromEvent(scrollableElement, 'scroll').pipe(
      debounceTime(100),
    );

    this.scrollSubscription = scrollObservable.subscribe(() => {
      const positionFromBottom = scrollPositionFromBottom(scrollableElement);
      this.scrolledToBottom = positionFromBottom <= 100;
    });
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }


  addLeft() {
    if (this.list.length === 0 || this.last_element(this.list) !== 1)
      this.list.push([1]);
    else this.last(this.list).push(1);
  }

  addRight() {
    if (this.list.length === 0 || this.last_element(this.list) !== 2)
      this.list.push([2]);
    else this.last(this.list).push(2);
  }

  last(array: Array<any>) {
    return array[array.length - 1];
  }

  last_element(array: Array<Array<any>>) {
    return this.last(this.last(array));
  }
}
