export interface RawTimestamped {
  created_at: Date;
  updated_at: Date;
}

export const timestampResolvers = {
  createdAt: (resource: RawTimestamped) => resource.created_at.toISOString(),
  updatedAt: (resource: RawTimestamped) => resource.updated_at.toISOString(),
};
