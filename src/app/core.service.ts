import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { tokenSetter } from './token-store';
import { baseUrl } from '../environments/base-url';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient, private router: Router) {}

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
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  userSignedIn(): boolean {
    return !!this.currentUser;
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
