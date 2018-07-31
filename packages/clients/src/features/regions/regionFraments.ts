import gql from 'graphql-tag';

const Core = gql`
  fragment RegionCore on Region {
    id
    name
    season
    seasonNumeric
    sku
  }
`;

const Flags = gql`
  fragment RegionFlags on Region {
    hidden
    premium
    editable
    hasPremiumAccess
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

const Banners = gql`
  fragment RegionBanners on Region {
    banners {
      nodes {
        id
        slug
        priority
        placement
        enabled
        source {
          kind
          ratio
          src
        }
        link
        extras
      }
    }
  }
`;

export const RegionFragments = {
  Bounds,
  Description,
  Core,
  POIs,
  Flags,
  Banners,
};
