import { gql } from 'react-apollo';

const Core = gql`
  fragment RegionCore on Region {
    _id
    name
    season
    seasonNumeric
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
    bounds {
      sw
      ne
      autocomplete
    }
  }
`;

// TODO: remove when https://github.com/apollographql/graphql-anywhere/issues/38 is resolved
const All = gql`
  fragment RegionAll on Region {
    ...RegionCore
    ...RegionBounds
    ...RegionPOIs
    description
  }
  ${Core}
  ${Bounds}
  ${POIs}
`;

export const RegionFragments = {
  All,
  Bounds,
  Core,
  POIs,
};
