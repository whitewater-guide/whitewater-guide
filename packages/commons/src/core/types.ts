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

export interface TextSearchFilter {
  search?: string;
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
