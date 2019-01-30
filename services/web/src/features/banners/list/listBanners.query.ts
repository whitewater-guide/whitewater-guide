import gql from 'graphql-tag';

export default gql`
  query listBanners {
    banners {
      nodes {
        id
        slug
        name
        priority
        placement
        enabled
        source {
          kind
          ratio
          src
        }
        regions {
          nodes {
            id
            name
          }
        }
        groups {
          nodes {
            id
            name
          }
        }
      }
      count
    }
  }
`;
