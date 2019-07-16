import { gmapsToArray } from './gmapsToArray';

it('should handle nulls', () => {
  expect(gmapsToArray(null)).toBeNull();
});

it('should handle objects', () => {
  expect(gmapsToArray({ lat: 10, lng: 20 })).toEqual([20, 10]);
});

it('should handle functions', () => {
  const latLng = { lat: () => 10, lng: () => 20 };
  expect(gmapsToArray(latLng as any)).toEqual([20, 10]);
});
