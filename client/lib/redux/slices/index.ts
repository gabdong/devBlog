import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import user, { UserState } from '@redux/slices/user';
import modal, { ModalState } from '@redux/slices/modal';

export interface CombinedSliceState {
  user: UserState;
  modal: ModalState;
}

export default function rootReducer(
  state: CombinedSliceState | undefined,
  action: UnknownAction,
) {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        modal,
      });
      return combinedReducer(state, action);
    }
  }
}
