import { RegionDetails } from '../../../ww-commons/features/regions/types';
import deserializeForm from './deserializeForm';
import { RegionFormInput } from './types';

const region: RegionDetails = {
  __typename: 'Region',
  id: 'id',
  language: 'en',
  name: 'foo',
  description: 'bar',
  season: 'season',
  seasonNumeric: [1, 2],
  hidden: false,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
  bounds: [[1, 1, 1], [2, 2, 2], [3, 4, 3]],
  pois: [
    {
      __typename: 'Point',
      id: 'point_id',
      language: 'en',
      name: 'point_name',
      coordinates: [1, 2, 0],
      description: 'point_description',
      kind: 'take-out',
    },
  ],
};

let result:RegionFormInput | undefined;

beforeEach(() => {
  result = deserializeForm(region);
});

it('should handle undefined input', () => {
  expect(deserializeForm(undefined)).toBeUndefined();
});

it('should handle null input', () => {
  expect(deserializeForm(undefined)).toBeUndefined();
});

it('should omit __typename', () => {
  expect(result).not.toHaveProperty('__typename');
});

it('should omit language', () => {
  expect(result).not.toHaveProperty('language');
});

it('should __typename from poi', () => {
  expect(result!.pois[0]).not.toHaveProperty('__typename');
});

it('should language from poi', () => {
  expect(result!.pois[0]).not.toHaveProperty('language');
});
