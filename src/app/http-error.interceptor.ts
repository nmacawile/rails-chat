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
import { CoreService } from './core.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private coreService: CoreService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 422) this.coreService.logOut();
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
}
