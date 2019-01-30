const ROMAN_NUMBERS = [
  '0',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
];

const SEPARATOR = (0.5).toString()[1];
const OTHER_SEPARATOR = SEPARATOR === ',' ? /\./ : /,/;

export function toRomanDifficulty(decimalDifficulty: number): string {
  if (Number.isInteger(decimalDifficulty)) {
    return ROMAN_NUMBERS[decimalDifficulty];
  }
  const floor = Math.floor(decimalDifficulty);
  return `${ROMAN_NUMBERS[floor]} - ${ROMAN_NUMBERS[floor + 1]}`;
}

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

/**
 * locale semi-agnostic string to float conversion
 * @param value String with either "," or "." as decimal separator
 * @returns Number
 */
export function strToFloat(value?: any): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return NaN;
  }
  const safeStr = value.replace(OTHER_SEPARATOR, SEPARATOR);
  return parseFloat(safeStr);
}
