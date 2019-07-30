import deburr from 'lodash/deburr';
import { NamedNode } from '../../apollo';
import { RegionsFilter } from './types';

export const filterRegions = <T extends NamedNode>(
  regions: T[],
  filter?: RegionsFilter | null,
): T[] => {
  if (!filter || !filter.search) {
    return regions;
  }
  const search = deburr(filter.search.trim().toLowerCase());
  return regions.filter(
    ({ name }) => deburr(name.trim().toLowerCase()).indexOf(search) >= 0,
  );
};
