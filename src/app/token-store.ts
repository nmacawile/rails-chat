import { User } from './user';

export function tokenGetter(): string {
  return localStorage.getItem('auth_token');
}

export function userGetter(): User {
  const userJson = localStorage.getItem('user');
  return JSON.parse(userJson);
}

export function userSetter(data: User) {
  localStorage.setItem('user', JSON.stringify(data));
}

export function tokenSetter(data: { auth_token: string, user: User}) {
  localStorage.setItem('auth_token', data['auth_token']);
  userSetter(data['user']);
}

export function tokenRemover() {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
}
