import { auth } from './firebase';
import { User } from '../types/users';

function deserializeUser(user: firebase.User): User {
  return {
    id: user.uid,
    name: user.displayName || '',
    email: user.email || '',
    token: '',
  };
}

async function login(email: string, password: string): Promise<User> {
  let result;
  try {
    result = await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    throw new Error(err.message);
  }

  if (!result.user) {
    throw new Error('Failed to retrieve user information.');
  }

  return deserializeUser(result.user);
}

export {
  login,
  deserializeUser,
};
