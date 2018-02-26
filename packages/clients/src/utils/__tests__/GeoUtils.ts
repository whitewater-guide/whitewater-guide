import { Coordinate2d } from '../../../ww-commons';
import {
  arrayToDMSString,
  arrayToGmaps,
  computeDistanceBetween,
  getBBox,
  getBoundsZoomLevel,
  getCoordinatesPatch,
  gmapsToArray,
} from '../GeoUtils';

test('Gmaps to array should handle nulls', () => {
  expect(gmapsToArray(null)).toBeNull();
});

test('Gmaps to array should handle objects', () => {
  expect(gmapsToArray({ lat: 10, lng: 20 })).toEqual([20, 10]);
});

test('Gmaps to array should handle functions', () => {
  const latLng = { lat: () => 10, lng: () => 20 };
  expect(gmapsToArray(latLng as any)).toEqual([20, 10]);
});

test('Array to gmaps should handle nulls', () => {
  expect(arrayToGmaps(null)).toBeNull();
});

test('Array to gmaps should work', () => {
  expect(arrayToGmaps([20, 10])).toEqual({ lat: 10, lng: 20 });
});

test('arrayToDMSString should work', () => {
  expect(arrayToDMSString([-122.902336, 46.9845854])).toBe('46°59′4″ N, 122°54′8″ W');
});

test('arrayToDMSString should ignore altitude', () => {
  expect(arrayToDMSString([-122.902336, 46.9845854, 100])).toBe('46°59′4″ N, 122°54′8″ W');
});

test('computeDistanceBetween should roughly match google maps', () => {
  let distance = computeDistanceBetween([-8.6568724, 41.1628634], [-7.9092951, 39.9203725]);
  distance = Math.round(distance * 100) / 100;
  // Google maps distance computed like this:
  // var a = new window.google.maps.LatLng(41.1628634, -8.6568724);
  // var b = new window.google.maps.LatLng(39.9203725, -7.9092951);
  // var d = window.google.maps.geometry.spherical.computeDistanceBetween(a, b);
  expect(distance).toBe(152.08);
});

test('Get zoom should match google maps', () => {
  // Google maps: https://jsfiddle.net/doomsower/vxLhnrxL/4/
  const bounds: Coordinate2d[] = [
    [-10.628008, 40.8984],
    [-6.584231, 42.847559],
  ];
  expect(getBoundsZoomLevel(bounds, { width: 600, height: 800 })).toBe(7);
});

test('getCoordinatesPatch should return null for equal arrays', () => {
  const prev: Coordinate2d[] = [[0, 0], [1, 1]];
  const next: Coordinate2d[] = [[0, 0], [1, 1]];
  expect(getCoordinatesPatch(prev, next)).toBeNull();
});

test('getCoordinatesPatch should handle updates', () => {
  const prev0: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next0: Coordinate2d[] = [[1, 1], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 1, [1, 1]]);
  const prev1: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next1: Coordinate2d[] = [[2, 4], [1, 1], [4, 16]];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 1, [1, 1]]);
  const prev2: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next2: Coordinate2d[] = [[2, 4], [3, 9], [1, 1]];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([2, 1, [1, 1]]);
});

test('getCoordinatesPatch should handle insertions', () => {
  const prev0: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next0: Coordinate2d[] = [[1, 1], [2, 4], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 0, [1, 1]]);
  const prev1: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next1: Coordinate2d[] = [[2, 4], [1, 1], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 0, [1, 1]]);
  const prev2: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  const next2: Coordinate2d[] = [[2, 4], [3, 9], [4, 16], [1, 1]];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([3, 0, [1, 1]]);
});

test('getCoordinatesPatch should handle deletions', () => {
  const prev0: Coordinate2d[] = [[1, 1], [2, 4], [3, 9], [4, 16]];
  const next0: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 1]);
  const prev1: Coordinate2d[] = [[2, 4], [1, 1], [3, 9], [4, 16]];
  const next1: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 1]);
  const prev2: Coordinate2d[] = [[2, 4], [3, 9], [4, 16], [1, 1]];
  const next2: Coordinate2d[] = [[2, 4], [3, 9], [4, 16]];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([3, 1]);
});

test('getBBOx should work', () => {
  const box: Coordinate2d[] = [[0, 0], [-10, 5], [-11, -21], [4, -23]];
  expect(getBBox(box)).toEqual([-11, 4, -23, 5]);
});
