import { Node } from '../core';
/**
 * Given two arrays, A and B, updates all items in A with newer items in B, and adds items that are not present in A
 * @param a
 * @param b
 */
export const updateList = <T extends Node>(a: T[], b: T[]): T[] => {
  const result: T[] = [];
  const rest: T[] = [...b];
  for (const prev of a) {
    const index = b.findIndex(({ id }) => id === prev.id);
    if (index === -1) {
      result.push(prev);
    } else {
      result.push(...rest.splice(index, 1));
    }
  }
  return [...result, ...rest];
};
