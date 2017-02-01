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
    seasonNumeric: [Int],
    bounds: Bounds,
    pois: [Point], 
    sources: [Source]!,
  }
  
  input CreateRegionInput {
    name: String!,
  }
  
  input EditRegionInput {
    _id: String!,
    name: String,
    description: String,
    season: String,
    seasonNumeric: Int,
  }
`;

export const regionQueries = `
  regions: [Region]!,
  region(_id: String!):Region,
`;

export const regionMutations = `
  createRegion(region:CreateRegionInput!):Region,
  editRegion(region:EditRegionInput!):Region,
  removeRegion(regionId:String!):Boolean,
`;