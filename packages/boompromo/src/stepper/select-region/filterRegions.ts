import take from 'lodash/take'
import { NamedNode } from '../../ww-commons';

const filterRegions = (regions: NamedNode[], inputValue: string | null) => {
  if (!inputValue) {
    return take(regions, 5);
  }
  return take(regions.filter(
    (r) => r.name.toLowerCase().includes(inputValue.toLowerCase()),
  ), 5);
};

export default filterRegions;
