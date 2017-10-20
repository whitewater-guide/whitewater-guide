import gql from 'graphql-tag';

const Core = gql`
  fragment RegionCore on Region {
    id
    language
    name
    season
    seasonNumeric
    hidden
  }
`;

const Description = gql`
  fragment RegionDescription on Region {
    description
  }
`;

const POIs = gql`
  fragment RegionPOIs on Region {
    pois {
      id
      language
      name
      description
      coordinates
      kind
    }
  }
`;

const Bounds = gql`
  fragment RegionBounds on Region {
    bounds
  }
`;

const All = gql`
  fragment RegionAll on Region {
    ...RegionCore
    ...RegionBounds
    ...RegionPOIs
    ...RegionDescription
    ...RegionStats
  }
  ${Core}
  ${Description}
  ${Bounds}
  ${POIs}
`;

export const RegionFragments = {
  All,
  Bounds,
  Description,
  Core,
  POIs,
};
