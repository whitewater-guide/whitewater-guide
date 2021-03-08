import { Node } from '../apollo';

export function isNode(v: unknown): v is Node {
  return typeof v === 'object' && !!v && 'id' in v;
}
