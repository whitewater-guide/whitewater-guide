import take from 'lodash/take';

import { PromoRegionFragment } from '../promoRegion.generated';

export default function filterRegions(
  regions: PromoRegionFragment[],
  inputValue: string | null,
): PromoRegionFragment[] {
  if (!inputValue) {
    return take(regions, 5);
  }
  return take(
    regions.filter((r) =>
      r.name.toLowerCase().includes(inputValue.toLowerCase()),
    ),
    5,
  );
}
