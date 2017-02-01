export const HarvestMode = `
  enum HarvestMode {
    ALL_AT_ONCE,
    ONE_BY_ONE,
  }
`;

export const Source = `
  type Source {
    _id: String!,
    name: String!,
    termsOfUse: String,
    script: String!,
    cron: String,
    harvestMode: HarvestMode!,
    url: String,
    enabled: Boolean,
    regions: [Region]!,
    #gauges: [Gauge]!,
  }
`;

export const sourceQueries = `
  sources: [Source]!,
  source(_id: String!): Source,
`;