import { createAction, props } from '@ngrx/store';
import { User } from './user';

export const logIn = createAction('[Auth] LogIn', props<{ auth_token: string; user: User }>());
export const logOut = createAction('[Auth] LogOut');
export const update = createAction('[Auth] Update', props());