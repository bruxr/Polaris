import { setApolloContext } from './apollo';

import { User } from '../types/users';

export function signin(user: User): void {
  localStorage.setItem('polaris_auth', JSON.stringify(user));
  setApolloContext(user.token);
}
