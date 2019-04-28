export function tokenGetter() {
  return localStorage.getItem('auth_token');
}

export function tokenSetter(token) {
  return localStorage.setItem('auth_token', token);
}
