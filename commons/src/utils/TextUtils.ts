const ROMAN_NUMBERS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const DECIMAL_POINT = (1.1).toLocaleString().substr(1, 1);
let K_SEPARATOR = (5000).toLocaleString().substr(1, 1);
if (K_SEPARATOR === '0') {
  K_SEPARATOR = (DECIMAL_POINT === '.' ? ',' : '.');
}

export function toRomanDifficulty(decimalDifficulty) {
  if (Number.isInteger(decimalDifficulty)) {
    return ROMAN_NUMBERS[decimalDifficulty];
  }
  const floor = Math.floor(decimalDifficulty);
  return `${ROMAN_NUMBERS[floor]} - ${ROMAN_NUMBERS[floor + 1]}`;
}

export function renderDifficulty({ difficulty, difficultyXtra }) {
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
export function strToFloat(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return NaN;
  }
  const safeStr = value.replace(/,/, '.');
  return parseFloat(safeStr);
}
