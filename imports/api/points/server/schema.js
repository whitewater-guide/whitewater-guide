export const Point = `
  type Point {
    _id: String!,
    name: String,
    description: String,
    coordinates: [Float!]!,
    altitude: Float,
    kind: String!,
  }
`;