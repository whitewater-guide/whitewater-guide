export interface Node {
  __typename?: string;
  id: string;
}

export interface NamedNode extends Node {
  name: string;
  language: string;
}

/**
 * This is result of graphql query
 * It will convert Dates to strings
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}