import { atom } from 'recoil';

export default atom<boolean>({
  key: 'noFooter',
  default: false,
});
