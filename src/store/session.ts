import { Action, action } from 'easy-peasy';

type SyncStatus = 'inactive' | 'active' | 'error';

export interface SessionModel {
  syncStatus: SyncStatus;
  syncError?: string;

  setSyncStatus: Action<SessionModel, SyncStatus>;
  setSyncError: Action<SessionModel, string>;
}

const sessionState: SessionModel = {
  syncStatus: 'inactive',

  setSyncStatus: action((state, sync) => {
    state.syncStatus = sync;
  }),

  setSyncError: action((state, error) => {
    state.syncError = error;
  }),
};

export default sessionState;
