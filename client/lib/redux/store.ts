import { configureStore, Reducer } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer, { CombinedSliceState } from '@redux/slices/index';

const createStore = () => {
  return configureStore({
    reducer: rootReducer as Reducer<CombinedSliceState>,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
const store = createStore();
const wrapper = createWrapper(createStore);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default wrapper;
