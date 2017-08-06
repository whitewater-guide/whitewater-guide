export interface Resource {
  id: string;
}

export interface NamedResource extends Resource {
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
