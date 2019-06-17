import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take, switchMap, filter } from 'rxjs/operators';
import { baseUrl } from '../environments/base-url';
import { Router } from '@angular/router';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { logIn, logOut, update } from './auth.actions';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  currentUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{ user: User }>,
    private snackBar: MatSnackBar,
  ) {
    this.store
      .pipe(select('auth'))
      .subscribe((user: User) => (this.currentUser = user));

    this.store
      .pipe(select('auth'))
      .pipe(
        take(1),
        filter((user: User) => !!user),
        switchMap(() => this.validateToken()),
      )
      .subscribe((user: User) => this.store.dispatch(update(user)));
  }

  validateToken() {
    return this.http.get(`https://${baseUrl}/auth/validate`);
  }

  logIn(loginInfo: { email: string; password: string }, returnUrl: string) {
    return this.http.post(`https://${baseUrl}/auth/login`, loginInfo).pipe(
      tap((data: { auth_token: string; user: User }) => {
        this.store.dispatch(logIn(data));
        this.router.navigate([returnUrl]);
        this.openSnackBar(`Welcome back, ${data.user.first_name}!`);
      }),
    );
  }

  register(registerInfo: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
  }) {
    return this.http.post(`https://${baseUrl}/signup`, registerInfo).pipe(
      tap((data: { auth_token: string; user: User }) => {
        this.store.dispatch(logIn(data));
        this.router.navigate(['/']);
        this.openSnackBar(`Welcome, ${data.user.first_name}!`);
      }),
    );
  }

  logOut() {
    this.store.dispatch(logOut());
    this.router.navigate(['/login']);
  }

  userSignedIn(): boolean {
    return !!this.currentUser;
  }

  updateVisibility(status: boolean) {
    return this.http
      .patch(`https://${baseUrl}/visibility`, { visible: status })
      .pipe(tap(() => this.store.dispatch(update({ visible: status }))));
  }

  update(userAttributes: any) {
    return this.http
      .patch(`https://${baseUrl}/edit/profile`, userAttributes)
      .pipe(
        tap(() => {
          this.store.dispatch(update(userAttributes));
          this.openSnackBar(`Update success.`);
        }),
      );
  }

  private openSnackBar(message) {
    this.snackBar.open(message, 'CLOSE', { duration: 5000 });
  }
}
