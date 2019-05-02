import { Component, ViewEncapsulation } from '@angular/core';
import { routeAnimation } from './animations';
import { CoreService } from './core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(private core: CoreService, private router: Router) {}

  logOut() {
    this.core.logOut();
    this.router.navigate(['/login']);
  }
}
