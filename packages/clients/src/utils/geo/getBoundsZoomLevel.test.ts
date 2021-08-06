import { getBoundsZoomLevel } from './getBoundsZoomLevel';
import { Coordinate2d } from './types';

it('Get zoom should match google maps', () => {
  // Google maps: https://jsfiddle.net/doomsower/vxLhnrxL/4/
  const bounds: Coordinate2d[] = [
    [-10.628008, 40.8984],
    [-6.584231, 42.847559],
  ];
  expect(getBoundsZoomLevel(bounds, { width: 600, height: 800 })).toBe(7);
});
