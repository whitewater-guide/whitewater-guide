import { strToFloat, toRomanDifficulty, renderDifficulty } from '../TextUtils';

test('strToFloat handles zeros', () => {
  expect(strToFloat('0')).toBe(0);
  expect(strToFloat('0.0')).toBe(0);
});

test('strToFloat handles integers', () => {
  expect(strToFloat('-100')).toBe(-100);
  expect(strToFloat('100')).toBe(100);
});

test('strToFloat handles dots', () => {
  expect(strToFloat('0.2')).toBe(0.2);
  expect(strToFloat('-0.2')).toBe(-0.2);
  expect(strToFloat('.2')).toBe(0.2);
});

test('strToFloat handles commas', () => {
  expect(strToFloat('0,2')).toBe(0.2);
  expect(strToFloat('-0,2')).toBe(-0.2);
  expect(strToFloat(',2')).toBe(0.2);
});

test('strToFloat handles empty strings', () => {
  expect(strToFloat('')).toBeNaN();
});

test('strToFloat handles undefined', () => {
  expect(strToFloat()).toBeNaN();
});

test('strToFloat handles null', () => {
  expect(strToFloat(null)).toBeNaN();
});

test('strToFloat handles numbers', () => {
  expect(strToFloat(7)).toBe(7);
  expect(strToFloat(7.7)).toBe(7.7);
});

test('toRomanDifficulty should integers', () => {
  expect(toRomanDifficulty(3)).toBe('III');
});

test('toRomanDifficulty should floats', () => {
  expect(toRomanDifficulty(3.5)).toBe('III - IV');
});

test('renderDifficulty without extra', () => {
  expect(renderDifficulty({ difficulty: 3.5 })).toBe('III - IV');
});
test('renderDifficulty with extra', () => {
  expect(renderDifficulty({ difficulty: 3.5, difficultyXtra: 'X' })).toBe('III - IV (X)');
});
