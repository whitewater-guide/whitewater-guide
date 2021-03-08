import { NamedNode } from '../apollo';
import { isNode } from './isNode';

export function isNamedNode(v: unknown): v is NamedNode {
  return isNode(v) && 'name' in v;
}
