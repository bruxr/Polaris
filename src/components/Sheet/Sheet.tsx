import React, { useEffect, useMemo, PropsWithChildren } from 'react';

import { createPortal } from 'react-dom';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';

import sheetAtom from '../../atoms/sheet';

interface Props {
  title?: string;
  onClose?: () => void;
}

export default function Sheet({ title, children, onClose }: PropsWithChildren<Props>): JSX.Element | null {
  const history = useHistory();

  const [, setSheetOptions] = useRecoilState(sheetAtom);

  const modals = useMemo(() => {
    return document.getElementById('modals');
  }, []);

  useEffect(() => {
    setSheetOptions({
      visible: true,
    });

    return () => {
      setSheetOptions({
        visible: false,
      });
    };
  }, [setSheetOptions]);

  if (!modals) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed left-0 top-0 w-screen h-screen opacity-75 z-40"
        style={{ backgroundColor: '#000' }}
        onClick={() => {
          if (onClose) {
            onClose();
          } else {
            history.goBack();
          }
        }}
      />
      <div className="fixed left-0 bottom-0 w-screen bg-white p-4 z-50 rounded-t-md">
        {title && (
          <h3 className="text-2xl font-bold text-center mb-3">{title}</h3>
        )}
        {children}
      </div>
    </>,
    modals,
  );
}
