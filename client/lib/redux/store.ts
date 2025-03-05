import { configureStore, Reducer } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer, { CombinedSliceState } from '@redux/slices/index';

const createStore = () => {
  return configureStore({
    reducer: rootReducer as Reducer<CombinedSliceState>,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // props로 callback fn을 전달해야 하는경우 대비
      }),
  });
};

const store = createStore();
const wrapper = createWrapper(createStore);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default wrapper;
