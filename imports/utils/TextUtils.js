const ROMAN_NUMBERS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function toRomanDifficulty(decimalDifficulty) {
  if (Number.isInteger(decimalDifficulty)){
    return ROMAN_NUMBERS[decimalDifficulty];
  }
  else {
    const floor = Math.floor(decimalDifficulty);
    return ROMAN_NUMBERS[floor] + '-' + ROMAN_NUMBERS[floor + 1];
  }
}