import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
}

const initialState: UserState = {
  name: 'guest',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = userSlice.actions;
export default userSlice.reducer;
