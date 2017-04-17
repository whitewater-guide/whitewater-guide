import {
  arrayToDMSString,
  computeDistanceBetween,
  getBoundsZoomLevel,
  gmapsToArray,
  arrayToGmaps,
  arrayBoundsToLatLngBounds,
  arrayBoundsToDeltaRegion,
  deltaRegionToArrayBounds,
  latLngBoundsToArrayBounds,
} from '../GeoUtils';

test('Gmaps to array should handle nulls', () => {
  expect(gmapsToArray(null)).toBeNull();
});

test('Gmaps to array should handle objects', () => {
  expect(gmapsToArray({ lat: 10, lng: 20 })).toEqual([20, 10]);
});

test('Gmaps to array should handle functions', () => {
  expect(gmapsToArray({ lat: () => 10, lng: () => 20 })).toEqual([20, 10]);
});

test('Array to gmaps should handle nulls', () => {
  expect(arrayToGmaps(null)).toBeNull();
});

test('Array to gmaps should work', () => {
  expect(arrayToGmaps([20, 10])).toEqual({ lat: 10, lng: 20 });
});

test('arrayBoundsToLatLngBounds should handle null', () => {
  expect(arrayBoundsToLatLngBounds(null)).toBeNull();
});

test('arrayBoundsToLatLngBounds should work', () => {
  const arr = { sw: [1, 2], ne: [3, 4] };
  const latLng = { sw: { lat: 2, lng: 1 }, ne: { lat: 4, lng: 3 } };
  expect(arrayBoundsToLatLngBounds(arr)).toEqual(latLng);
});

test('arrayBoundsToDeltaRegion should handle null', () => {
  expect(arrayBoundsToDeltaRegion(null)).toBeNull();
});

test('arrayBoundsToDeltaRegion should work', () => {
  const arr = { sw: [10, 20], ne: [20, 40] };
  const region = { latitude: 30, longitude: 15, latitudeDelta: 10, longitudeDelta: 5 };
  expect(arrayBoundsToDeltaRegion(arr)).toEqual(region);
});

test('deltaRegionToArrayBounds should handle null', () => {
  expect(deltaRegionToArrayBounds(null)).toBeNull();
});

test('deltaRegionToArrayBounds should work', () => {
  const arr = { sw: [10, 20], ne: [20, 40] };
  const region = { latitude: 30, longitude: 15, latitudeDelta: 10, longitudeDelta: 5 };
  expect(deltaRegionToArrayBounds(region)).toEqual(arr);
});

test('latLngBoundsToArrayBounds should work', () => {
  const arr = { sw: [1, 2], ne: [3, 4] };
  const latLng = { sw: { lat: 2, lng: 1 }, ne: { lat: 4, lng: 3 } };
  expect(latLngBoundsToArrayBounds(latLng)).toEqual(arr);
});

test('latLngBoundsToArrayBounds should handle null', () => {
  expect(latLngBoundsToArrayBounds(null)).toBeNull();
});

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