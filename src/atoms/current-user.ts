import { atom } from 'recoil';

import { User } from '../types/users';

type CurrentUser = User | undefined;

export default atom<CurrentUser>({
  key: 'currentUser',
  default: undefined,
});
