import { getCoordinatesPatch } from './getCoordinatesPatch';
import type { Coordinate2d } from './types';

it('should return null for equal arrays', () => {
  const prev: Coordinate2d[] = [
    [0, 0],
    [1, 1],
  ];
  const next: Coordinate2d[] = [
    [0, 0],
    [1, 1],
  ];
  expect(getCoordinatesPatch(prev, next)).toBeNull();
});

it('should handle single point', () => {
  const prev: Coordinate2d[] = [[3, 4]];
  const next: Coordinate2d[] = [[5, 6]];
  expect(getCoordinatesPatch(prev, next)).toEqual([0, 1, [5, 6]]);
});

it('should handle updates', () => {
  const prev0: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next0: Coordinate2d[] = [
    [1, 1],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 1, [1, 1]]);
  const prev1: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next1: Coordinate2d[] = [
    [2, 4],
    [1, 1],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 1, [1, 1]]);
  const prev2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [1, 1],
  ];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([2, 1, [1, 1]]);
});

it('should handle insertions', () => {
  const prev0: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next0: Coordinate2d[] = [
    [1, 1],
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 0, [1, 1]]);
  const prev1: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next1: Coordinate2d[] = [
    [2, 4],
    [1, 1],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 0, [1, 1]]);
  const prev2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
    [1, 1],
  ];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([3, 0, [1, 1]]);
});

it('should handle deletions', () => {
  const prev0: Coordinate2d[] = [
    [1, 1],
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  const next0: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev0, next0)).toEqual([0, 1]);
  const prev1: Coordinate2d[] = [
    [2, 4],
    [1, 1],
    [3, 9],
    [4, 16],
  ];
  const next1: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev1, next1)).toEqual([1, 1]);
  const prev2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
    [1, 1],
  ];
  const next2: Coordinate2d[] = [
    [2, 4],
    [3, 9],
    [4, 16],
  ];
  expect(getCoordinatesPatch(prev2, next2)).toEqual([3, 1]);
});
