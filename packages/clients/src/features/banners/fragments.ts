import gql from 'graphql-tag';

const Core = gql`
  fragment BannerCore on Banner {
    id
    name
    slug
    priority
    enabled
    placement
    source {
      kind
      url
    }
    link
    extras
  }
`;

export const BannerFragments = {
  Core,
};
