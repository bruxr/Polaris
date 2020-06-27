import { atom } from 'recoil';

interface AddCallback {
  onShow: () => void;
  onHide: () => void;
}

export default atom<undefined | AddCallback>({
  key: 'addButton',
  default: undefined,
});
