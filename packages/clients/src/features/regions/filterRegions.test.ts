import type { NamedNode } from '@whitewater-guide/schema';

import { filterRegions } from './filterRegions';

const regions: NamedNode[] = [
  {
    id: '1',
    name: 'foo',
  },
  {
    id: '2',
    name: ' bar ',
  },
  {
    id: '5',
    name: 'Québec',
  },
  {
    id: '4',
    name: 'Quebec',
  },
];

it('should ignore undefined filter', () => {
  expect(filterRegions(regions)).toBe(regions);
});

it('should ignore null filter', () => {
  expect(filterRegions(regions, null)).toBe(regions);
});

it('should ignore empty search string filter', () => {
  expect(filterRegions(regions, { searchString: '' })).toBe(regions);
});

it('should search', () => {
  expect(filterRegions(regions, { searchString: ' r ' })).toEqual([
    {
      id: '2',
      name: ' bar ',
    },
  ]);
});

it('should search with freaky characters', () => {
  expect(filterRegions(regions, { searchString: ' éb ' })).toHaveLength(2);
});
