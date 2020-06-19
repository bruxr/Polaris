import { atom } from 'recoil';

import { User } from '../types/users';

export default atom<User | undefined>({
  key: 'user',
  default: undefined,
});
