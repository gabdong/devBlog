import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//TODO 모달 한번에 여러개 띄워야할경우 array로 변경
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
      console.log('close modal');
      return initialState;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
