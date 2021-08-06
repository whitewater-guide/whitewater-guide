import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';

import { useRegionSkUsQuery } from './regionSKUs.generated';
import { SKU } from './types';

export default (): Map<SKU, boolean> => {
  const [skus, setSkus] = useState<Map<SKU, boolean>>(new Map());
  const { data } = useRegionSkUsQuery({
    fetchPolicy: 'cache-only',
  });
  useEffect(() => {
    const newSkus = new Map<SKU, boolean>();
    if (data) {
      data.regions.nodes.forEach(({ sku, hasPremiumAccess }) => {
        if (sku) {
          newSkus.set(sku, hasPremiumAccess);
        }
      });
    }
    if (!isEqual(newSkus, skus)) {
      setSkus(newSkus);
    }
  }, [data, skus, setSkus]);
  return skus;
};
