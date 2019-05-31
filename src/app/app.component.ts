import { Component, ViewEncapsulation } from '@angular/core';
import { routeAnimation } from './animations';
import { CoreService } from './core.service';
import { Router } from '@angular/router';
import { userSetter } from './token-store';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  visible: boolean;

  constructor(private coreService: CoreService, private router: Router) {
    if (this.coreService.userSignedIn()) {
      this.coreService.validateToken().subscribe((userData: User) => {
        userSetter(userData);
        this.visible = this.coreService.currentUser.visible;
      });
    }
  }

  logOut() {
    this.coreService.logOut();
    this.router.navigate(['/login']);
  }

  toggleVisibility() {
    this.coreService.updateVisibility(this.visible).subscribe();
  }
}
