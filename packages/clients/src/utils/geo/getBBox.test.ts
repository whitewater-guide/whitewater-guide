import { Coordinate2d } from '@whitewater-guide/commons';

import { getBBox } from './getBBox';

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
