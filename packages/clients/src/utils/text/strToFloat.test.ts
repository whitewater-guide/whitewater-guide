import { strToFloat } from './strToFloat';

it('should handle zeros', () => {
  expect(strToFloat('0')).toBe(0);
  expect(strToFloat('0.0')).toBe(0);
});

it('should handle integers', () => {
  expect(strToFloat('-100')).toBe(-100);
  expect(strToFloat('100')).toBe(100);
});

it('should handle dots', () => {
  expect(strToFloat('0.2')).toBe(0.2);
  expect(strToFloat('-0.2')).toBe(-0.2);
  expect(strToFloat('.2')).toBe(0.2);
});

it('should handle commas', () => {
  expect(strToFloat('0,2')).toBe(0.2);
  expect(strToFloat('-0,2')).toBe(-0.2);
  expect(strToFloat(',2')).toBe(0.2);
});

it('should handle empty strings', () => {
  expect(strToFloat('')).toBeNaN();
});

it('should handle undefined', () => {
  expect(strToFloat()).toBeNaN();
});

it('should handle null', () => {
  expect(strToFloat(null)).toBeNaN();
});

it('should handle numbers', () => {
  expect(strToFloat(7)).toBe(7);
  expect(strToFloat(7.7)).toBe(7.7);
});
