export interface RawTimestamped {
  created_at: Date;
  updated_at: Date;
}

/**
 * This is result of graphql query
 * It will convert Dates to strings
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export const timestampResolvers = {
  createdAt: (resource: RawTimestamped) => resource.created_at.toISOString(),
  updatedAt: (resource: RawTimestamped) => resource.updated_at.toISOString(),
};
