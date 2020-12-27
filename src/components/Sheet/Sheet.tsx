import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';
import Modal from 'react-modal';

import styles from './Sheet.module.css';

interface Props {
  open?: boolean;
  title?: string;
  onClose?: () => void;
}

export default function Sheet({ open, title, children, onClose }: PropsWithChildren<Props>): JSX.Element {
  return (
    <Modal
      isOpen={open || false}
      closeTimeoutMS={150}
      className={{
        beforeClose: styles.modalClose,
        base: classnames('fixed bottom-0 w-full bg-black p-4 transition', styles.modal),
        afterOpen: styles.modalShown,
      }}
      overlayClassName={{
        beforeClose: styles.overlayClose,
        base: classnames('fixed inset-0 w-full h-screen z-50', styles.overlay),
        afterOpen: styles.overlayShown,
      }}
      onRequestClose={() => {
        if (onClose) {
          onClose();
        }
      }}
    >
      {title && (
        <h2 className="font-mono text-sm text-gray-900 text-center mt-2 mb-6">{title}</h2>
      )}
      {children}
    </Modal>
  );
}
