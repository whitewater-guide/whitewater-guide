import { Reference } from '@apollo/client';

/**
 * Given two arrays, A and B, updates all items in A with newer items in B, and adds items that are not present in A
 * @param existing
 * @param incoming
 */
export function updateList<T extends Reference>(
  existing: T[],
  incoming: T[],
): T[] {
  const result: T[] = [];
  const rest: T[] = [...incoming];
  for (const prev of existing) {
    const index = rest.findIndex(({ __ref }) => __ref === prev.__ref);
    if (index === -1) {
      result.push(prev);
    } else {
      result.push(...rest.splice(index, 1));
    }
  }

  return [...result, ...rest];
}
