import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
