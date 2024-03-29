import { parseDifficultyString } from './parseDifficultyString';

// human-checked data from other sources
const difficulties: Array<[string, number]> = [
  ['IV-V', 4.5],
  ['III-IV', 3.5],
  ['II', 2],
  ['III', 3],
  ['II-III', 2.5],
  ['IV-', 4],
  ['III+', 3],
  ['V-', 5],
  ['IV', 4],
  ['I', 1],
  ['I-II', 1.5],
  ['IV+', 4],
  ['V-VI', 5.5],
  ['VI', 6],
  ['V', 5],
  ['V+', 5],
  ['III-', 3],
  ['I/2', 1.5],
  ['II/2-3', 2.5],
  ['II/3', 2.5],
  ['II+', 2],
  ['II-', 2],
  ['IV+,V,(X)', 4.5],
  ['III', 3],
  ['III,IV,(V)', 3.5],
  ['II,II+', 2],
  ['IV,V', 4.5],
  ['III+', 3],
  ['II,III', 2.5],
  ['V,(X)', 5],
  ['IV,IV+', 4],
  ['III+,IV', 3.5],
  ['V', 5],
  ['III,III+', 3],
  ['IV,V,(V+)', 4.5],
  ['V,(V+)', 5],
  ['II,III,IV', 3.5],
  ['III+,IV+', 3.5],
  ['III+,IV,(IV+)', 3.5],
  ['IV,IV+,V', 4.5],
  ['IV,IV+,(X)', 4],
  ['III,IV,(IV+)', 3.5],
  ['IV,(V),(X)', 4],
  ['II+,III', 2.5],
  ['IV,V,(X)', 4.5],
  ['II+,III+', 2.5],
  ['III,IV', 3.5],
  ['I,II+', 1.5],
  ['IV,(V)', 4],
  ['IV,V+', 4.5],
  ['IV', 4],
  ['III,IV+', 3.5],
  ['II+', 2],
  ['II', 2],
  ['III,IV,(V+)', 3.5],
  ['I,II', 1.5],
  ['III+,IV,(X)', 3.5],
  ['IV+,(V)', 4],
  ['II+,III+,(IV+)', 2.5],
  ['IV+,V+', 4.5],
  ['I,II,II+', 1.5],
  ['III+,(IV),(X)', 3],
  ['IV+,(V+)', 4],
  ['III,III+,(IV)', 3],
  ['?', 1],
  ['II+,III,(IV)', 2.5],
  ['IV+,V', 4.5],
  ['II,III,(IV+)', 2.5],
  ['III,IV,IV+', 3.5],
  ['IV,IV+,(V)', 4],
  ['IV,IV+,(VI)', 4],
  ['II,III,(IV)', 2.5],
  ['V,V+', 5],
  ['I', 1],
  ['III+,(IV)', 3],
  ['IV+,(X)', 4],
  ['III+,IV,(V)', 3.5],
  ['IV+,(V),(X)', 4],
  ['IV+,V,V+', 4.5],
  ['IV,V,(VI)', 4.5],
  ['II,III+', 2.5],
  ['III,(IV)', 3],
  ['IV+', 4],
  ['V,(VI)', 5],
  ['III,IV,V', 4.5],
];

it.each(difficulties)('.parseRomanDifficult("%s", %d)', (roman, arabic) => {
  expect(parseDifficultyString(roman)).toBe(arabic);
});
