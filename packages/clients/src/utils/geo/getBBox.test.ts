import { getBBox } from './getBBox';
import { Coordinate2d } from './types';

it('should return bbox', () => {
  const box: Coordinate2d[] = [
    [0, 0],
    [-10, 5],
    [-11, -21],
    [4, -23],
  ];
  expect(getBBox(box)).toEqual([
    [4, 5],
    [-11, -23],
  ]);
});

it('should return flat bbox', () => {
  const box: Coordinate2d[] = [
    [0, 0],
    [-10, 5],
    [-11, -21],
    [4, -23],
  ];
  expect(getBBox(box, true)).toEqual([-11, 4, -23, 5]);
});
