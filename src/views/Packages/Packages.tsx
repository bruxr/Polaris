import React, { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';

import PackageItem from './PackageItem';
import Spinner from '../../components/Spinner';
import AddPackageSheet from './AddPackageSheet';
import addButtonAtom from '../../atoms/add-button';
import { PackageStub } from '../../types/packages';
import { deserializePackageStub } from '../../deserializers/packages';
import PACKAGES, { PackageStubResult } from '../../graphql/queries/packages';

export default function Packages(): JSX.Element {
  const [, setAddButtonCallback] = useRecoilState(addButtonAtom);

  const [addShown, setAddShown] = useState(false);

  const { data, loading } = useQuery(PACKAGES);

  const packages = useMemo<PackageStub[]>(() => {
    if (!data) {
      return [];
    }

    return data.packages.map((pkg: PackageStubResult) => deserializePackageStub(pkg));
  }, [data]);

  useEffect(() => {
    // setAddButtonCallback({
    //   onShow: () => {
    //     setAddShown(true);
    //   },
    //   onHide: () => {
    //     setAddShown(false);
    //   },
    // });
  }, [setAddButtonCallback]);

  return (
    <>
      {/* Loading state */}
      {loading && (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      )}
      
      {/* Empty state */}
      {!loading && packages.length === 0 && (
        <div className="text-center text-sm text-gray-500">No packages yet.</div>
      )}

      {/* Normal state */}
      <div className="divide-y">
        {packages.map((pkg) => <PackageItem key={pkg.id} pkg={pkg} />)}
      </div>

      {addShown && (
        <AddPackageSheet />
      )}
    </>
  );
}
