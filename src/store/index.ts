import { createStore, createTypedHooks, Action, action } from 'easy-peasy';

import { User } from '../types/users';
import session, { SessionModel } from './session';

interface StoreModel {
  session: SessionModel;

  footerVisible: boolean;
  currentUser?: User;
  addBtnClick?: () => void;
  title?: string;

  setFooterVisible: Action<StoreModel, boolean>;
  setCurrentUser: Action<StoreModel, User>;
  setTitle: Action<StoreModel, string | undefined>;
  setAddBtn: Action<StoreModel, (() => void) | undefined>;
}

const store = createStore<StoreModel>({
  session,
  footerVisible: true,

  setFooterVisible: action((state, visible) => {
    state.footerVisible = visible;
  }),

  setCurrentUser: action((state, user) => {
    state.currentUser = user;
  }),

  setTitle: action((state, title) => {
    state.title = title;
  }),

  setAddBtn: action((state, fn) => {
    state.addBtnClick = fn;
  }),
});

const typedHooks = createTypedHooks<StoreModel>();
const { useStoreActions, useStoreState } = typedHooks;

export {
  store,
  useStoreActions,
  useStoreState,
};
