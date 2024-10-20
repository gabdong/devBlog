import { combineReducers } from '@reduxjs/toolkit';

import user from '@redux/slices/user';

const rootReducer = combineReducers({
  user,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
