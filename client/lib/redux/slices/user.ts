import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
  name: 'guest',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    initializeUser: () => {
      return initialState;
    },
  },
});

export const { setUser, initializeUser } = userSlice.actions;
export default userSlice.reducer;
