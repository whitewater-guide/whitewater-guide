import { useMemo } from 'react';
import { ValuesType } from 'utility-types';

import { RegionsListQuery } from './regionsList.generated';

export type ListedRegion = ValuesType<RegionsListQuery['regions']['nodes']>;

export interface RegionSubtitleData {
  __typename: 'Subtitle';
  id: string;
  key?: string;
}

/**
 * If regions contain some favorites, creates array of favorite regions, all regions with subtitles in between
 * Also adds keys, so we don't have favorite regions with same list keys as regular regions
 * @param regions
 * @returns
 */
export default function useFavRegions(
  regions?: ListedRegion[],
): Array<(ListedRegion & { key?: string }) | RegionSubtitleData> {
  return useMemo(() => {
    const regs = regions ?? [];
    const favs = regs.filter((r) => r.favorite);
    if (favs.length === 0) {
      return regs;
    }
    return [
      { __typename: 'Subtitle', id: 'screens:regionsList.favorites' },
      ...favs.map((f) => ({ ...f, key: `fav_${f.id}` })),
      { __typename: 'Subtitle', id: 'screens:regionsList.all' },
      ...regs,
    ];
  }, [regions]);
}
