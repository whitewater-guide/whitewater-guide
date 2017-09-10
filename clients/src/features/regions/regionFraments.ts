import gql from 'graphql-tag';

const Core = gql`
  fragment RegionCore on Region {
    id
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

const Stats = gql`
  fragment RegionStats on Region {
    riversCount
    sectionsCount
  }
`;

// TODO: remove when https://github.com/apollographql/graphql-anywhere/issues/38 is resolved
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
  ${Stats}
`;

export const RegionFragments = {
  All,
  Bounds,
  Description,
  Core,
  POIs,
  Stats,
};
