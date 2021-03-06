import React, { useEffect, useState } from 'react';

import AddPackageSheet from './AddPackageSheet';

export default function Packages(): JSX.Element {

  const [addShown] = useState(false);

  useEffect(() => {
    // setAddButtonCallback({
    //   onShow: () => {
    //     setAddShown(true);
    //   },
    //   onHide: () => {
    //     setAddShown(false);
    //   },
    // });
  }, []);

  return (
    <>
      {/* Loading state */}
      {/* {loading && (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      )}
      
      {/* Empty state}
      {!loading && packages.length === 0 && (
        <div className="text-center text-sm text-gray-500">No packages yet.</div>
      )}

      {/* Normal state}
      <div className="divide-y">
        {packages.map((pkg) => <PackageItem key={pkg.id} pkg={pkg} />)}
      </div> */}

      {addShown && (
        <AddPackageSheet />
      )}
    </>
  );
}
