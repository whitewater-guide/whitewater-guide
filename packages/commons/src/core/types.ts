export interface Node {
  __typename?: string;
  id: string;
}

export interface NamedNode extends Node {
  name: string;
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
  formData: {[key: string]: string};
  key: string | null;
}
