import { createPortal } from 'react-dom';
import { ReactPortal } from 'react';

import useModal from '@hooks/useModal';
import { useAppSelector } from '@redux/hooks';

import LoginModal from '@components/modals/LoginModal';

const MODAL_MAP: {
  [key: string]: () => JSX.Element;
} = {
  login: LoginModal,
};

export default function ModalContainer(): ReactPortal | null {
  const { closeModal } = useModal();
  const { type, props } = useAppSelector((store) => store.modal);

  if (!type || typeof window === 'undefined') return null;

  const Modal = MODAL_MAP[type];

  return createPortal(
    <div>
      <span>모달</span>
      <span onClick={closeModal}>x</span>
      <Modal {...props} />
    </div>,
    document.getElementById('modal') as HTMLElement,
  );
}
