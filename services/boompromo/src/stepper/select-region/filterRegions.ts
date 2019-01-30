import { NamedNode } from '@whitewater-guide/commons';
import take from 'lodash/take';

const filterRegions = (regions: NamedNode[], inputValue: string | null) => {
  if (!inputValue) {
    return take(regions, 5);
  }
  return take(
    regions.filter((r) =>
      r.name.toLowerCase().includes(inputValue.toLowerCase()),
    ),
    5,
  );
};

export default filterRegions;
