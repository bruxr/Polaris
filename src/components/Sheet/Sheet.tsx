import React, { PropsWithChildren } from 'react';

interface Props {
  title?: string;
  onClose?: () => void;
}

export default function Sheet({ title, children, onClose }: PropsWithChildren<Props>): JSX.Element {
  return (
    <>
      <button
        type="button"
        className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"
        onClick={() => {
          if (onClose) {
            onClose();
          }
        }}
      >
        Close Sheet
      </button>
      <div className="fixed bottom-0 left-0 w-screen bg-white p-4 z-10">
        {title && (
          <header className="text-center mb-4 pb-4 border-b border-gray-300">
            <h3 className="text-xl font-semibold">{title}</h3>
          </header>
        )}
        {children}
      </div>
    </>
  );
}
