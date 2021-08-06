import { NamedNode, RegionFilterOptions } from '@whitewater-guide/schema';
import deburr from 'lodash/deburr';

/**
 * filterRegions is used to filter regions on client side
 * @param regions
 * @param filter
 * @returns
 */
export function filterRegions<T extends NamedNode>(
  regions: T[],
  filter?: RegionFilterOptions | null,
): T[] {
  if (!filter || !filter.searchString) {
    return regions;
  }
  const search = deburr(filter.searchString.trim().toLowerCase());
  return regions.filter(
    ({ name }) => deburr(name.trim().toLowerCase()).indexOf(search) >= 0,
  );
}
