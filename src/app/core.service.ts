import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {
  tokenSetter,
  tokenRemover,
  userGetter,
  userSetter,
} from './token-store';
import { baseUrl } from '../environments/base-url';
import { Router } from '@angular/router';
import { CableService } from './cable.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cableService: CableService,
  ) {
    if (this.userSignedIn()) {
      this.validateToken().subscribe((userData: User) => userSetter(userData));
    }
  }

  validateToken() {
    return this.http.get(`https://${baseUrl}/auth/validate`);
  }

  logIn(loginInfo: { email: string; password: string }) {
    return this.http
      .post(`https://${baseUrl}/auth/login`, loginInfo)
      .pipe(tap(tokenSetter));
  }

  register(registerInfo: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
  }) {
    return this.http
      .post(`https://${baseUrl}/signup`, registerInfo)
      .pipe(tap(tokenSetter));
  }

  logOut() {
    tokenRemover();
    this.cableService.disconnect();
    this.router.navigate(['/login']);
  }

  userSignedIn(): boolean {
    return !!this.currentUser;
  }

  get currentUser() {
    return userGetter();
  }
}
