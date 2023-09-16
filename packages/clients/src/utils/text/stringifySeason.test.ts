import type { SeasonLocalizer } from './stringifySeason';
import { stringifySeason } from './stringifySeason';

test('should return empty string for empty input', () => {
  expect(stringifySeason()).toBe('');
  expect(stringifySeason([])).toBe('');
});

test('should return single half-month', () => {
  expect(stringifySeason([0])).toBe('early January');
  expect(stringifySeason([1])).toBe('late January');
});

test('should return single month', () => {
  expect(stringifySeason([0, 1])).toBe('January');
});

test('should return one range', () => {
  expect(stringifySeason([1, 2, 3, 4])).toBe('late January - early March');
  expect(stringifySeason([1, 2, 3, 4, 5])).toBe('late January - March');
  expect(stringifySeason([2, 3, 4, 5])).toBe('February - March');
  expect(stringifySeason([0, 1, 2])).toBe('January - early February');
});

test('should return two ranges', () => {
  expect(stringifySeason([0, 1, 2, 3, 5])).toBe(
    'January - February, late March',
  );
});

test('should loop around new year', () => {
  expect(stringifySeason([0, 1, 4, 5, 20, 21, 22, 23])).toBe(
    'March, November - January',
  );
  expect(stringifySeason([0, 1, 22, 23])).toBe('December - January');
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
  expect(stringifySeason([0, 5], true)).toBe('January - March');
  expect(stringifySeason([22, 1], true)).toBe('December - January');
});

test('should support custom localize function', () => {
  const localizer: SeasonLocalizer = (key: any, halfMonth?: any) => {
    if (key === 'all') {
      return 'ALL YEAR';
    }
    return `${key} ${halfMonth}`.toUpperCase();
  };
  expect(stringifySeason([0, 23], true, localizer)).toBe('ALL YEAR');
  expect(stringifySeason([1, 2, 3, 4], false, localizer)).toBe(
    'LATE 1 - EARLY 4',
  );
});
