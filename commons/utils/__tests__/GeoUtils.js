import { arrayToDMSString, computeDistanceBetween, getBoundsZoomLevel } from '../GeoUtils';

test('arrayToDMSString should work', () => {
  expect(arrayToDMSString([-122.902336, 46.9845854])).toBe('46°59′4″ N, 122°54′8″ W');
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
  const bounds = {
    sw: [-10.628008, 40.8984],
    ne: [-6.584231, 42.847559],
  };
  expect(getBoundsZoomLevel(bounds, { width: 600, height: 800 })).toBe(7);
});