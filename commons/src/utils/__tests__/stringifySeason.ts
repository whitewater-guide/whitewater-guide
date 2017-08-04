import stringifySeason from '../stringifySeason';

jest.mock('moment');

test('should return empty string for empty input', () => {
  expect(stringifySeason()).toBe('');
  expect(stringifySeason([])).toBe('');
});

test('should return single half-month', () => {
  expect(stringifySeason([0])).toBe('early jan');
  expect(stringifySeason([1])).toBe('late jan');
});

test('should return single month', () => {
  expect(stringifySeason([0, 1])).toBe('jan');
});

test('should return one range', () => {
  expect(stringifySeason([1, 2, 3, 4])).toBe('late jan - early mar');
  expect(stringifySeason([1, 2, 3, 4, 5])).toBe('late jan - mar');
  expect(stringifySeason([2, 3, 4, 5])).toBe('feb - mar');
  expect(stringifySeason([0, 1, 2])).toBe('jan - early feb');
});

test('should return two ranges', () => {
  expect(stringifySeason([0, 1, 2, 3, 5])).toBe('jan - feb, late mar');
});

test('should loop around new year', () => {
  expect(stringifySeason([0, 1, 4, 5, 20, 21, 22, 23])).toBe('mar, nov - jan');
  expect(stringifySeason([0, 1, 22, 23])).toBe('dec - jan');
});

test('should return all year around', () => {
  const year = [];
  for (let i = 0; i < 24; i += 1) {
    year.push(i);
  }
  expect(stringifySeason(year)).toBe('all year around');
});

test('should handle ranges', () => {
  expect(stringifySeason([0, 23], true)).toBe('all year around');
  expect(stringifySeason([0, 5], true)).toBe('jan - mar');
  expect(stringifySeason([22, 1], true)).toBe('dec - jan');
});