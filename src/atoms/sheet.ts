import { atom } from 'recoil';

interface SheetAtom {
  visible: boolean;
}

export default atom<SheetAtom>({
  key: 'sheet',
  default: {
    visible: false,
  },
});
