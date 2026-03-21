import type { FieldsByType } from './types';

export const copyFieldsByType = (from: FieldsByType, to: FieldsByType) => {
  for (const [key, fields] of from.entries()) {
    const toSet = to.get(key) || new Set<string>();
    for (const field of fields.values()) {
      toSet.add(field);
    }
    to.set(key, toSet);
  }
};
