export interface RawTimestamped {
  created_at: Date;
  updated_at: Date;
}

export const timestampResolvers = {
  createdAt: (resource: RawTimestamped) => new Date(resource.created_at).toISOString(),
  updatedAt: (resource: RawTimestamped) => new Date(resource.updated_at).toISOString(),
};
