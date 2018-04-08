import gql from 'graphql-tag';

const Core = gql`
  fragment RegionCore on Region {
    id
    name
    season
    seasonNumeric
  }
`;

const Flags = gql`
  fragment RegionFlags on Region {
    hidden
    premium
    editable
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

export const RegionFragments = {
  Bounds,
  Description,
  Core,
  POIs,
  Flags,
};
