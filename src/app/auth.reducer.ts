import { createReducer, on } from '@ngrx/store';
import { userGetter, tokenSetter, tokenRemover, userUpdater } from './token-store';
import { User } from './user';
import { logIn, logOut, update } from './auth.actions';

const initialState = userGetter();

export const authReducer = createReducer(
  initialState,
  on(logIn, (state, payload) => {
    tokenSetter(payload);
    return payload.user;
  }),
  on(logOut, state => {
    tokenRemover();
    return null;
  }),
  on(update, (state, payload) => {
    const payloadCopy = { ...payload };
    delete payloadCopy.type;
    const updatedUser = userUpdater(payloadCopy);
    return updatedUser;
  }),
);
