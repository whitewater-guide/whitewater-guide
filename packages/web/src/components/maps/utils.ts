import { Point, Section } from '@whitewater-guide/schema';

export function isPoint(p: unknown): p is Point {
  return (p as any)?.__typename === 'Point';
}

export function isSection(p: unknown): p is Section {
  return (p as any)?.__typename === 'Section';
}
