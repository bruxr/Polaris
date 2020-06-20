import React from 'react';

import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';

export default function Notifications(): JSX.Element {
  return (
    <div className="divide-y">
      <div className="flex p-4 bg-indigo-100">
        <LocalShippingIcon className="mr-4" />
        <div className="text-gray-600">
          <h3 className="font-medium text-blue-900">Packages</h3>
          Lazada package has been shipped by our logistic partner.
          <div className="text-gray-500 text-sm mt-1">2 days ago</div>
        </div>
      </div>
      <div className="flex p-4">
        <LocalShippingIcon className="mr-4" />
        <div className="text-gray-600">
          <h3 className="font-medium text-blue-900">Packages</h3>
          Lazada package has been shipped by our logistic partner.
          <div className="text-gray-500 text-sm mt-1">2 days ago</div>
        </div>
      </div>
    </div>
  );
}
