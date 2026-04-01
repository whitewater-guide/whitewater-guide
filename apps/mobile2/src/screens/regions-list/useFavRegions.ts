import { useMemo } from 'react';
import type { ValuesType } from 'utility-types';

import type { RegionsListQuery } from './regionsList.generated';

export type ListedRegion = ValuesType<RegionsListQuery['regions']['nodes']>;

export interface RegionSubtitleData {
  __typename: 'Subtitle';
  id: string;
  key?: string;
}

/**
 * If regions contain some favorites, creates array of favorite regions and rest regions with subtitle rows in between.
 */
export default function useFavRegions(
  regions: ListedRegion[] = [],
): Array<ListedRegion | RegionSubtitleData> {
  return useMemo(() => {
    const favs: ListedRegion[] = [];
    const rest: ListedRegion[] = [];
    for (const r of regions) {
      if (r.favorite) {
        favs.push(r);
      } else {
        rest.push(r);
      }
    }
    if (favs.length === 0) {
      return rest;
    }
    // if all regions are favorites, just return all regions
    if (rest.length === 0) {
      return favs;
    }

    return [
      { __typename: 'Subtitle', id: 'screens:regionsList.favorites' },
      ...favs,
      { __typename: 'Subtitle', id: 'screens:regionsList.all' },
      ...rest,
    ];
  }, [regions]);
}
