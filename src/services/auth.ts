import { setApolloContext } from './apollo';

interface User {
  id: string;
  email: string;
  token: string;
}

export function signin(user: User): void {
  localStorage.setItem('polaris_auth', JSON.stringify(user));
  setApolloContext(user.token);
}
