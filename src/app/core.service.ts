import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { tokenSetter } from './token-store';
import { baseUrl } from '../environments/base-url';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient) {}

  logIn(loginInfo: { email: string; password: string }) {
    return this.http
      .post(`https://${baseUrl}/auth/login`, loginInfo)
      .pipe(tap(tokenSetter));
  }
}
