import { Component, ViewEncapsulation } from '@angular/core';
import { routeAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
