import { Node } from '../__generated__/types';

export function isNode(v: unknown): v is Node {
  return typeof v === 'object' && !!v && 'id' in v;
}
