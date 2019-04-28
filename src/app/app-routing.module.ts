import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: ChatListComponent,
    data: { type: 'ChatList' },
  },
  {
    path: 'chat/:id',
    component: ChatComponent,
    data: { type: 'Chat' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { type: 'Login' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
