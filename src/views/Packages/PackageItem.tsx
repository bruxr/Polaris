import React from 'react';

import { DateTime } from 'luxon';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { PackageStub, Courier } from '../../types/packages';

interface Props {
  pkg: PackageStub;
}

export default function Package({ pkg }: Props): JSX.Element {
  const { id, courier, code, lastStatus, eta } = pkg;


  return (
    <Link to={`/packages/${id}`} className="block py-4 mb-4">
      <div className={classnames(
        'text-xs uppercase inline-block',
        {
          'text-teal-500': courier === Courier.Jinio,
          'text-orange-600': courier === Courier.Lazada,
          'text-orange-700': courier === Courier.LBC,
        }
      )}>
        {courier}
      </div>
      <div className="mb-1">
        {lastStatus}
      </div>
      <div className="text-xs text-gray-500">
        <span className="inline-block pr-1">{code}</span>
        &middot;
        <span className={classnames(
          'inline-block pl-1',
          { 'text-red-500': eta <= DateTime.utc() }
        )}>
          ETA {eta.toFormat('MMM d')}
        </span>
      </div>
    </Link>
  );
}
