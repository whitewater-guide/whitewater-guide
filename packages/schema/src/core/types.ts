import { PageInfo } from '../__generated__/types';

/**
 * Relay-styles edge
 **/
export interface Edge<TNode> {
  node: TNode;
  cursor: CodegenCursor;
}

/**
 * Relay-styles connection
 **/
export interface RelayConnection<TNode> {
  edges: Array<Edge<TNode>>;
  pageInfo: PageInfo;
}
