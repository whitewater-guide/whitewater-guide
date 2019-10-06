import { Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';
import { SKU } from './types';

const SKUS_QUERY = gql`
  query regionSKUs {
    regions {
      nodes {
        id
        sku
        hasPremiumAccess
      }
    }
  }
`;

interface Result {
  regions: {
    nodes: Array<Pick<Region, 'id' | 'sku' | 'hasPremiumAccess'>>;
  };
}

export default (): Map<SKU, boolean> => {
  const [skus, setSkus] = useState<Map<SKU, boolean>>(new Map());
  const { data } = useQuery<Result>(SKUS_QUERY, {
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
