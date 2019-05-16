import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { MaterialModule } from './material/material.module';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { LoginComponent } from './login/login.component';

import { tokenGetter } from './token-store';
import { baseUrl } from '../environments/base-url';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { RegisterComponent } from './register/register.component';
import { AttachHeaderInterceptor } from './attach-header.interceptor';
import { ActionCableService } from 'angular2-actioncable';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    MessageComponent,
    ChatListComponent,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [baseUrl],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AttachHeaderInterceptor,
      multi: true,
    },
    ActionCableService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
