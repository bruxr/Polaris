import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';

type Props = {
  title?: string;
  className?: string;
}

function Card({ title, className, children }: PropsWithChildren<Props>): React.ReactElement {
  return (
    <section className={classnames('border border-gray-700 p-4 mb-4', className)}>
      {title && <h2 className="text-sm text-gray-500 mb-3">{title}</h2>}
      {children}
    </section>
  );
}

export default Card;
