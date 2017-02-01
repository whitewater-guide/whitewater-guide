export const Bounds = `
  type Bounds {
    sw: [Float],
    ne: [Float],
    autocomplete: Boolean,
  }
`;

export const Region = `
  type Region {
    _id: String!,
    name: String,
    description: String,
    season: String,
    seasonNumeric: Int!,
    bounds: Bounds,
    pois: [Point], 
    sources: [Source]!,
  }
`;

export const regionQueries = `
  regions: [Region]!,
  region(_id: String!):Region,
`;