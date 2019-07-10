import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { routeAnimation } from './animations';
import { CoreService } from './core.service';
import { Router } from '@angular/router';
import { userSetter } from './token-store';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { CableService } from './cable.service';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy {
  visible: boolean;
  mediaSubscription: Subscription;
  smallScreen: boolean;

  constructor(
    public coreService: CoreService,
    private cableService: CableService,
    private router: Router,
    private store: Store<{ user: User }>,
    public media: MediaObserver,
  ) {
    this.store.pipe(select('auth')).subscribe((user: User) => {
      this.visible = user && user.visible;
      if (user) this.cableService.connect();
      else this.cableService.disconnect();
    });

    this.mediaSubscription = media.media$.subscribe(
      mediaChange => {
        if (
          mediaChange.mqAlias == 'xs' ||
          mediaChange.mqAlias == 'sm')
          this.smallScreen = true;
        else
          this.smallScreen = false;
      }
    );
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
  }

  logOut() {
    this.coreService.logOut();
  }

  toggleVisibility() {
    this.coreService.updateVisibility(this.visible).subscribe();
  }
}
