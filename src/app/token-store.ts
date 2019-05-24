import { User } from './user';

export function tokenGetter() {
  return localStorage.getItem('auth_token');
}

export function userGetter() {
  const userJson = localStorage.getItem('user');
  return JSON.parse(userJson);
}

export function tokenSetter(data) {
  localStorage.setItem('auth_token', data['auth_token']);
  localStorage.setItem('user', JSON.stringify(data['user']));
}

export function tokenRemover() {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
}
