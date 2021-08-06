import { ensureAltitude } from './ensureAltitude';

it('should convert empty array', () => {
  expect(ensureAltitude([])).toEqual([]);
});

it('should convert coordinate 2d', () => {
  expect(ensureAltitude([1, 2])).toEqual([1, 2, 0]);
});

it('should not change coordinate 3d', () => {
  expect(ensureAltitude([1, 2, 3])).toEqual([1, 2, 3]);
});

it('should convert loose coordinate', () => {
  expect(ensureAltitude([1, 2, null])).toEqual([1, 2, 0]);
});

it('should convert array of coordinates', () => {
  expect(
    ensureAltitude([
      [1, 2],
      [3, 4, null],
      [5, 6, 7],
    ]),
  ).toEqual([
    [1, 2, 0],
    [3, 4, 0],
    [5, 6, 7],
  ]);
});
