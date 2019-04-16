import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  list: number[] = [1, 1, 2, 2, 1, 1];

  constructor() {}

  ngOnInit() {}
}
