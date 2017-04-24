import { gql } from 'react-apollo';

const Core = gql`
  fragment RegionCore on Region {
    _id
    name
    season
    seasonNumeric
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
      _id
      name
      description
      coordinates
      altitude
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
  Core,
  POIs,
  Stats,
};
