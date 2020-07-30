import { atom } from 'recoil';

type AddButton = {
  onClick?: () => void;
}

export default atom<AddButton>({
  key: 'addBtn',
  default: {},
});
