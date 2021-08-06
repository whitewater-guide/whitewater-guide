import { Section } from '@whitewater-guide/schema';

import { toRomanDifficulty } from './toRomanDifficulty';

export type DifficultyFragment = Pick<Section, 'difficulty' | 'difficultyXtra'>;

export function renderDifficulty({
  difficulty,
  difficultyXtra,
}: DifficultyFragment): string {
  let result = toRomanDifficulty(difficulty);
  if (difficultyXtra) {
    result = `${result} (${difficultyXtra})`;
  }
  return result;
}
