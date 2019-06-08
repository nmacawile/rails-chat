import { Component, ViewEncapsulation } from '@angular/core';
import { routeAnimation } from './animations';
import { CoreService } from './core.service';
import { Router } from '@angular/router';
import { userSetter } from './token-store';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { CableService } from './cable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  visible: boolean;

  constructor(
    private coreService: CoreService,
    private cableService: CableService,
    private router: Router,
    private store: Store<{ user: User }>,
  ) {
    this.store.pipe(select('auth')).subscribe((user: User) => {
      this.visible = user && user.visible;
      if (user) this.cableService.connect();
      else this.cableService.disconnect();
    });
  }

  logOut() {
    this.coreService.logOut();
  }

  toggleVisibility() {
    this.coreService.updateVisibility(this.visible).subscribe();
  }
}
