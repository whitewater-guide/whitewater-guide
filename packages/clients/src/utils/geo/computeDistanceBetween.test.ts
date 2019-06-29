import { computeDistanceBetween } from './computeDistanceBetween';

it('should roughly match google maps', () => {
  let distance = computeDistanceBetween(
    [-8.6568724, 41.1628634],
    [-7.9092951, 39.9203725],
  );
  distance = Math.round(distance * 100) / 100;
  // Google maps distance computed like this:
  // var a = new window.google.maps.LatLng(41.1628634, -8.6568724);
  // var b = new window.google.maps.LatLng(39.9203725, -7.9092951);
  // var d = window.google.maps.geometry.spherical.computeDistanceBetween(a, b);
  expect(distance).toBe(152.08);
});
