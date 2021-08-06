const STRINGS = [
  'VI',
  'IV',
  'V',
  'III',
  'II',
  'I',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
];
const STRINGS_TO_ARABIC = new Map([
  ['VI', 6],
  ['V', 5],
  ['IV', 4],
  ['III', 3],
  ['II', 2],
  ['I', 1],
  ['6', 6],
  ['5', 5],
  ['4', 4],
  ['3', 3],
  ['2', 2],
  ['1', 1],
]);
const stringToArabic = (roman: string): number =>
  STRINGS_TO_ARABIC.get(roman) || 0;

export const parseDifficultyString = (roman: string): number => {
  let mainRoman = roman.split('(')[0];
  const arabics: number[] = [];
  for (const digit of STRINGS) {
    if (mainRoman.indexOf(digit) >= 0) {
      arabics.push(stringToArabic(digit));
      mainRoman = mainRoman.replace(new RegExp(digit, 'g'), '');
    }
  }
  if (arabics.length === 0) {
    return 1;
  }
  const hardest = arabics.sort().slice(-2);
  const sum = hardest.reduce((v, s) => s + v, 0);
  return sum / hardest.length;
};
