import { createPortal } from 'react-dom';
import { ReactPortal } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import useModal from '@hooks/useModal';
import { useAppSelector } from '@redux/hooks';

import xBtn from '@public/images/x_btn.png';
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
    <>
      <ModalContainerSt>
        <XBtnSt onClick={closeModal}>
          <Image src={xBtn} alt="x_button" />
        </XBtnSt>
        <Modal {...props} />
      </ModalContainerSt>
      <ModalBackgroundSt onClick={closeModal} />
    </>,
    document.getElementById('modal') as HTMLElement,
  );
}

const ModalContainerSt = styled.div`
  max-width: 80%;
  min-width: 200px;
  min-height: 140px;
  border: 0.5px solid var(--primary-color);
  border-radius: 12px;
  background: var(--dark);

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;
const ModalBackgroundSt = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);

  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
`;
const XBtnSt = styled.button`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 10px;
  top: 10px;

  & img {
    width: 100%;
    height: 100%;
  }
`;
