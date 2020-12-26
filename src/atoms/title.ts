import { atom } from 'recoil';

export default atom<string | undefined>({
  key: 'title',
  default: undefined,
});
