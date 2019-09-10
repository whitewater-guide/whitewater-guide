import { arrayToLatLngString } from './arrayToLatLngString';

it('should be empty for undefined', () => {
  expect(arrayToLatLngString()).toBe('');
});

it('should be rounded', () => {
  expect(arrayToLatLngString([10.123456, 10, 19])).toBe('10.0000, 10.1235');
});
