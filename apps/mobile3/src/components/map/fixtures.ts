import type { PointCoreFragment } from '@whitewater-guide/schema';

import type { MapSection } from './types';

import type { Coordinates } from '@/types/coordinates';

export const SAMPLE_BOUNDS: Coordinates[] = [
  [42.5, 42.0, 0],
  [43.5, 42.0, 0],
  [43.5, 43.0, 0],
  [42.5, 43.0, 0],
  [42.5, 42.0, 0],
];

export const SAMPLE_SECTION: MapSection = {
  __typename: 'Section',
  id: 'section-1',
  name: 'Upper Gorge',
  difficulty: 4,
  difficultyXtra: '+',
  rating: 4.2,
  verified: true,
  demo: false,
  distance: 8.5,
  duration: null,
  drop: 120,
  season: 'April - October',
  seasonNumeric: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  river: { __typename: 'River', id: 'river-1', name: 'Argun' },
  putIn: {
    __typename: 'Point',
    id: 'put-in-1',
    coordinates: [43.0, 42.5, 0],
    name: 'Put-in',
    description: null,
    kind: 'put-in',
  },
  takeOut: {
    __typename: 'Point',
    id: 'take-out-1',
    coordinates: [43.2, 42.6, 0],
    name: 'Take-out',
    description: null,
    kind: 'take-out',
  },
  shape: [
    [43.0, 42.5, 0],
    [43.1, 42.55, 0],
    [43.2, 42.6, 0],
  ],
  flowsText: null,
  approximate: false,
};

export const SAMPLE_POI: PointCoreFragment = {
  __typename: 'Point',
  id: 'poi-1',
  name: 'Riverside Campsite',
  description:
    'A beautiful campsite right by the river. Facilities include fire pits and toilets. Good access road.',
  kind: 'campsite',
  coordinates: [43.15, 42.52, 0],
};

export const SAMPLE_SECTIONS: MapSection[] = [SAMPLE_SECTION];
export const SAMPLE_POIS: PointCoreFragment[] = [SAMPLE_POI];
