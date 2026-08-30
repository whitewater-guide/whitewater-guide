import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

void MaterialCommunityIcons.loadFont();

const STAR = 984270;
const STAR_OUTLINE = 984274;
const STAR_HALF = 984272;

function getStarString(value: number): string {
  const result: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (value - i === 0.5) {
      result.push(STAR_HALF);
    } else if (value > i) {
      result.push(STAR);
    } else {
      result.push(STAR_OUTLINE);
    }
  }
  return String.fromCodePoint(...result);
}

export const STAR_STRINGS: Map<number, string> = new Map(
  Array.from({ length: 11 }, (_, i) => [i * 0.5, getStarString(i * 0.5)]),
);
