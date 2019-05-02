import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error instanceof ErrorEvent)
          errorMessage = `ERROR: ${error.error.message}`;
        else
          errorMessage = `ERROR CODE ${error.status}: ${error.error.message}`;
        this.openSnackBar(errorMessage);
        return throwError(errorMessage);
      }),
    );
  }

  private openSnackBar(message) {
    this.snackBar.open(message, 'CLOSE', { duration: 5000 });
  }
}
