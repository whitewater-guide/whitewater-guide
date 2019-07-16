import { arrayToGmaps } from './arrayToGmaps';

it('should work', () => {
  expect(arrayToGmaps([20, 10])).toEqual({ lat: 10, lng: 20 });
});

it('should handle nulls', () => {
  expect(arrayToGmaps(null)).toBeNull();
});
