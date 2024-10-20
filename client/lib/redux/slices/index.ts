import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import user, { UserState } from '@redux/slices/user';

export interface CombinedSliceState {
  user: UserState;
}
const combinedReducer = combineReducers({
  user,
});
const rootReducer = (
  state: CombinedSliceState | undefined,
  action: UnknownAction,
) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default:
      return combinedReducer(state, action);
  }
};

export default rootReducer;
