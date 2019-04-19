import { Injectable } from '@angular/core';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';

import { debounceTime, map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const THRESHOLD = 100;

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  scrolledToBottom: boolean = true;

  constructor(private scrollDispatcher: ScrollDispatcher) {
    const scrollableElement = document.querySelector('.mat-drawer-content');

    const scrollObservable = this.scrollDispatcher.scrolled().pipe(
      debounceTime(100),
      filter((scrollable: CdkScrollable) => {
        return scrollable.getElementRef().nativeElement === scrollableElement;
      }),
    );

    scrollObservable
      .pipe(
        map(
          (scrollable: CdkScrollable) =>
            scrollable.measureScrollOffset('bottom') <= THRESHOLD,
        ),
      )
      .subscribe((bottom: boolean) => {
        this.scrolledToBottom = bottom;
      });
  }
}
