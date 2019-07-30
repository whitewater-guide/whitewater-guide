import { configDateFNS } from './configDateFNS';
import { getMonthName } from './getMonthName';

it('should throw for incorrect input', () => {
  expect(() => getMonthName(22)).toThrow();
});

it('should work in english', () => {
  expect(getMonthName(1)).toBe('February');
});

it('should work in english nominative', () => {
  expect(getMonthName(1, false)).toBe('February');
});

it('should work in russian', () => {
  configDateFNS('ru');
  expect(getMonthName(1)).toBe('февраля');
});

it('should work in russian nominative', () => {
  configDateFNS('ru');
  expect(getMonthName(1, false)).toBe('февраль');
});
