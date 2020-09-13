import getRouteMatch from './getRouteMatch';
import { BreadcrumbsMap } from './types';

const map: BreadcrumbsMap = {
  '/regions': 'Regions',
  '/regions/:regionId': 'Region',
  '/regions/:regionId/sections': 'Sections',
  '/regions/:regionId/sections/:sectionId': 'Section',
};

it('should find match with params', () => {
  expect(getRouteMatch(map, '/regions/123/sections/456')).toEqual({
    path: '/regions/123/sections/456',
    param: { id: '456' },
    value: 'Section',
  });
});

it('should find match without params', () => {
  expect(getRouteMatch(map, '/regions')).toEqual({
    path: '/regions',
    param: null,
    value: 'Regions',
  });
});

it('should not find match', () => {
  expect(getRouteMatch(map, '/pokemons/123/sections/456')).toBeNull();
});
