import type { SkMatrix, Vector } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export function scale(matrix: SkMatrix, s: number, origin: Vector): SkMatrix {
  'worklet';
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.scale(s, s);
  source.translate(-origin.x, -origin.y);
  return source;
}

export function translate(matrix: SkMatrix, x: number, y: number): SkMatrix {
  'worklet';
  const m = Skia.Matrix();
  m.translate(x, y);
  m.concat(matrix);
  return m;
}
