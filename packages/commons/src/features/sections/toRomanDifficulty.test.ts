import { toRomanDifficulty } from './toRomanDifficulty';

it('toRomanDifficulty should integers', () => {
  expect(toRomanDifficulty(3)).toBe('III');
});

it('toRomanDifficulty should floats', () => {
  expect(toRomanDifficulty(3.5)).toBe('III - IV');
});
