import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  type: string;
  props?: object;
}

const initialState: ModalState = {
  type: '',
  props: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalState>) => {
      const { type, props } = action.payload;
      state.type = type;
      state.props = props;
    },
    closeModal: () => {
      return initialState;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
