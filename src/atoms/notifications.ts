import { atom } from 'recoil';

import { Notification } from '../types/notifications';

export default atom<Notification[]>({
  key: 'notifications',
  default: [],
});
