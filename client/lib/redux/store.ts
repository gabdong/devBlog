import { configureStore, Reducer, UnknownAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer, { CombinedSliceState } from '@redux/slices/index';

const store = () =>
  configureStore({
    reducer: rootReducer as Reducer<CombinedSliceState, UnknownAction>,
    devTools: process.env.NODE_ENV !== 'production',
  });
const wrapper = createWrapper(store);

export type RootState = ReturnType<ReturnType<typeof store>['getState']>;
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore['dispatch'];

export default wrapper;
