import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuard } from './auth.guard';
import { AnonymousGuard } from './anonymous.guard';

const routes: Routes = [
  {
    path: '',
    component: ChatListComponent,
    data: { type: 'ChatList' },
    canActivate: [AuthGuard],
  },
  {
    path: 'chat/:id',
    component: ChatComponent,
    data: { type: 'Chat' },
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/profile',
    component: EditProfileComponent,
    data: { type: 'EditProfile' },
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { type: 'Login' },
    canActivate: [AnonymousGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { type: 'Register' },
    canActivate: [AnonymousGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
