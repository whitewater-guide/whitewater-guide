export interface RawTimestamped {
  created_at: Date;
  updated_at: Date;
}

export interface WithLanguage {
  language: string;
}

export const timestampResolvers = {
  createdAt: (node: RawTimestamped) => new Date(node.created_at).toISOString(),
  updatedAt: (node: RawTimestamped) => new Date(node.updated_at).toISOString(),
};
