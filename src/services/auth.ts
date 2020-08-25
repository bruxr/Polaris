import { setAuthToken } from './apollo';

import { User } from '../types/users';

export function signin(user: User): void {
  localStorage.setItem('polaris_auth', JSON.stringify(user));
  setAuthToken(user.token);
}

export function readCredentials(): User | void {
  const data = localStorage.getItem('polaris_auth');
  if (!data) {
    return;
  }

  let user: User;
  try {
    user = JSON.parse(data);
  } catch (err) {
    console.warn(`Failed to parse authentication JSON: ${err.message}`);
    localStorage.removeItem('polaris_auth');
    return;
  }

  return user;
}
