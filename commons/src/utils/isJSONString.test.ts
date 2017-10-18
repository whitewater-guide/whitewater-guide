import { isJSONString } from './isJSONString';

it('should handle null', () => {
  expect(isJSONString(null)).toBe(false);
});

it('should handle undefined', () => {
  expect(isJSONString(undefined)).toBe(false);
});

it('should handle numbers', () => {
  expect(isJSONString(111)).toBe(false);
});

it('should handle strings', () => {
  expect(isJSONString('foo')).toBe(false);
});

it('should handle Dates', () => {
  expect(isJSONString(new Date())).toBe(false);
});

it('should handle JSON', () => {
  expect(isJSONString('{"foo": "bar"}')).toBe(true);
});

it('should handle JSON array', () => {
  expect(isJSONString('["foo", "bar"]')).toBe(true);
});
