export const typedefs = `
  enum SectionSortBy {
    name
    difficulty
    duration
    rating
  }

  enum SortDirection {
    ASC
    DESC
  }

  type SectionSearchTerms {
    sortBy: SectionSortBy
    sortDirection: SortDirection
    searchString: String
    difficulty: [Float!]
    duration: [Int!]
    rating: Float
    seasonNumeric: [Int!]
    withTags: [String!]
    withoutTags: [String!]
  }

  input SectionSearchTermsInput {
    sortBy: SectionSortBy
    sortDirection: SortDirection
    searchString: String
    difficulty: [Float!]
    duration: [Int!]
    rating: Float
    seasonNumeric: [Int!]
    withTags: [String!]
    withoutTags: [String!]
  }

  type Region {
    selectedSection: Section
    selectedPOI: Point
    selectedBounds: [[Float!]]
  }

  type Mutation {
    setSelectedSection(regionId: ID!, sectionId: ID): Section
    setSelectedPOI(regionId: ID!, pointId: ID): Point
    setSelectedBounds(regionId: ID!, bounds: [[Float!]]): Region
  }
`;
