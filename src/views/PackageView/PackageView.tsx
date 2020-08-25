import React, { useEffect, useState, useMemo, useCallback } from 'react';

import isUndefined from 'lodash-es/isUndefined';
import { useParams, useHistory } from 'react-router';
import { useMutation, useLazyQuery } from '@apollo/client';

import Sheet from '../../components/Sheet';
import Button from '../../components/Button';
import { isPast } from '../../services/date';
import Spinner from '../../components/Spinner';
import apolloClient from '../../services/apollo';
import PACKAGES from '../../graphql/queries/packages';
import lbc from '../../assets/images/couriers/lbc.png';
import { Package, Courier } from '../../types/packages';
import lazada from '../../assets/images/couriers/lel.png';
import jinio from '../../assets/images/couriers/jinio.png';
import { deserializePackage } from '../../deserializers/packages';
import RECEIVE_PACKAGE from '../../graphql/mutations/receive-package';
import GET_PACKAGE, { PackageQuery, PackageResult } from '../../graphql/queries/get-package';

export default function PackageView(): JSX.Element {
  const { id } = useParams();
  const history = useHistory();

  const [pkg, setPkg] = useState<Package | undefined>(undefined);

  const [receivePackage, { loading: receivedLoading }] = useMutation(
    RECEIVE_PACKAGE,
    { variables: { id, received: true } },
  );
  const [getPackage, { data }] = useLazyQuery<PackageQuery>(GET_PACKAGE, { variables: { id } });

  // Determine courier image
  const courierImg = useMemo(() => {
    if (!pkg) {
      return undefined;
    }

    switch (pkg.courier) {
      case Courier.Jinio:
        return jinio;
      case Courier.Lazada:
        return lazada;
      case Courier.LBC:
        return lbc;
    }
  }, [pkg]);

  // Handle received button
  const handleOnReceived = useCallback(async () => {
    await receivePackage({
      update: (cache) => {
        const result = cache.readQuery<PackageQuery>({ query: PACKAGES });
        cache.writeQuery({
          query: PACKAGES,
          data: { packages: result?.packages.filter((pkg) => pkg.id !== id) },
        });
      },
    });
    history.push('/packages');
  }, [id, history, receivePackage]);

  // Load full package data if it isn't present
  useEffect(() => {
    const result = apolloClient.readQuery<PackageQuery>({ query: PACKAGES });
    if (!result) {
      getPackage();
      return;
    }

    const pkg: PackageResult | undefined = result.packages.find((pkg) => pkg.id === id);
    if (pkg && !isUndefined(pkg.received)) {
      console.log(pkg);
      setPkg(deserializePackage(pkg));
    } else {
      getPackage();
    }
  }, [id, getPackage]);

  // Set package if data is loaded
  useEffect(() => {
    console.log(data);
    if (data) {
      if (data.packages.length > 0) {
        setPkg(deserializePackage(data.packages[0]));
      } else {
        alert('Package not found!');
        history.replace('/packages');
      }
    }
  }, [data, history]);

  return (
    <Sheet>
      {!pkg && (
        <div className="flex justify-center"><Spinner /></div>
      )}

      {pkg && (
        <div  className="text-center">
          <div className="flex justify-center">
            <img src={courierImg} alt={pkg.courier} className="w-24 h-24" />
          </div>

          <h4 className="font-bold mb-1">Package</h4>
          <div className="mb-2">
            {isPast(pkg.eta) && <span className="text-red-500">Delayed {pkg.eta.toRelative()}</span>}
            {!isPast(pkg.eta) && <span>Arriving {pkg.eta.toRelative()}</span>}
          </div>
          <div className="font-mono text-gray-500 text-xs mb-6">
            {pkg.code}
          </div>
          
          <h4 className="font-bold mb-1">Last Update</h4>
          <div className="mb-2">
            {pkg.lastStatus}
          </div>
          <div className="text-xs text-gray-500 mb-8">
            {pkg.lastTimestamp.toRelative()}
          </div>

          <Button loading={receivedLoading} onClick={handleOnReceived}>
            Received
          </Button>
        </div>
      )}
    </Sheet>
  );
}
