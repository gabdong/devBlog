import { useAppDispatch } from '@redux/hooks';
import { closeModal, openModal } from '@redux/slices/modal';

export default function useModal() {
  const dispatch = useAppDispatch();

  const handleOpenModal = ({ type, props }: ModalState) => {
    dispatch(openModal({ type, props }));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}
