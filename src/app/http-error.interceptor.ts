import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logOut } from './auth.actions';
import { User } from './user';

const INVALID_TOKEN_MESSAGES = [
  new RegExp('Not enough or too many segments'),
  new RegExp('Signature has expired'),  
  new RegExp('Missing token'),
];

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<{ user: User }>,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      tap({
        error: (error: HttpErrorResponse) => {
          if (
            error.status === 422 &&
            this.invalidTokenMessage(error.error.message)
          ) {
            this.store.dispatch(logOut());
            this.router.navigate(['/login']);
          }
        },
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        errorMessage =
          error instanceof ErrorEvent
            ? `ERROR: ${error.error.message}`
            : `ERROR CODE ${error.status}: ${error.error.message}`;
        this.openSnackBar(errorMessage);
        return throwError(errorMessage);
      }),
    );
  }

  private openSnackBar(message) {
    this.snackBar.open(message, 'CLOSE', { duration: 5000 });
  }

  private invalidTokenMessage(message: string) {
    return INVALID_TOKEN_MESSAGES.some(messagePattern =>
      messagePattern.test(message),
    );
  }
}
