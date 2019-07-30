import { toRomanDifficulty } from '@whitewater-guide/commons';

export interface DifficultyFragment {
  difficulty: number;
  difficultyXtra?: string | null;
}

export function renderDifficulty({
  difficulty,
  difficultyXtra,
}: DifficultyFragment) {
  let result = toRomanDifficulty(difficulty);
  if (difficultyXtra) {
    result = `${result} (${difficultyXtra})`;
  }
  return result;
}
