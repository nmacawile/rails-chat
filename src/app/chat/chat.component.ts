import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit {
  list: Array<Array<number>> = [];

  constructor() {}

  ngOnInit() {}

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
