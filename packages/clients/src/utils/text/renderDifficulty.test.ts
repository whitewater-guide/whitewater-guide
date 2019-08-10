import { renderDifficulty } from './renderDifficulty';

it('should render without extra', () => {
  expect(renderDifficulty({ difficulty: 3.5 })).toBe('III - IV');
});

it('should render with extra', () => {
  expect(renderDifficulty({ difficulty: 3.5, difficultyXtra: 'X' })).toBe(
    'III - IV (X)',
  );
});
