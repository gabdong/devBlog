import { combineReducers, UnknownAction } from '@reduxjs/toolkit';

import user from '@redux/slices/user';
import modal from '@redux/slices/modal';

export interface CombinedSliceState {
  user: UserState;
  modal: ModalState;
}

export default function rootReducer(
  state: CombinedSliceState | undefined,
  action: UnknownAction,
) {
  switch (action.type) {
    default: {
      const combinedReducer = combineReducers({
        user,
        modal,
      });
      return combinedReducer(state, action);
    }
  }
}
