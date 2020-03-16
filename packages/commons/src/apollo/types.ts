export const NEW_ID = '__NEW_ID__';

export interface Node {
  __typename?: string;
  id: string;
}

export interface Page {
  __typename?: 'Page';
  limit?: number;
  offset?: number;
}

export interface Connection<T> {
  __typename?: string;
  count?: number;
  nodes?: T[];
}

export interface NamedNode extends Node {
  name: string;
}

export interface NodeRef extends Node {
  name?: string;
}

export interface SearchableFilterOptions {
  searchString?: string;
}

/**
 * This is result of graphql query
 * It will convert Dates to strings
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface UploadLink {
  postURL: string;
  formData: { [key: string]: string };
  key: string | null;
}
