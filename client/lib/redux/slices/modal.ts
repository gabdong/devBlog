import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    closeModal: (): ModalState => {
      return initialState;
    },
    initializeModal: (): ModalState => {
      return initialState;
    },
  },
});

export const { openModal, closeModal, initializeModal } = modalSlice.actions;
export default modalSlice.reducer;
