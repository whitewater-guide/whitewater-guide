import deburr from 'lodash/deburr';

import { NamedNode } from '../../apollo';
import { RegionFilterOptions } from './types';

export const filterRegions = <T extends NamedNode>(
  regions: T[],
  filter?: RegionFilterOptions | null,
): T[] => {
  if (!filter || !filter.searchString) {
    return regions;
  }
  const search = deburr(filter.searchString.trim().toLowerCase());
  return regions.filter(
    ({ name }) => deburr(name.trim().toLowerCase()).indexOf(search) >= 0,
  );
};
