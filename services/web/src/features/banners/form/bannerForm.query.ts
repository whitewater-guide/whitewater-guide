import gql from 'graphql-tag';

export default gql`
  query bannerForm($bannerId: ID) {
    banner(id: $bannerId) {
      id
      slug
      name
      priority
      enabled
      placement
      source {
        kind
        ratio
        src
      }
      link
      extras
      regions {
        nodes {
          id
          name
        }
        count
      }
      groups {
        nodes {
          id
          name
        }
        count
      }
    }

    regions {
      nodes {
        id
        name
      }
      count
    }

    groups {
      nodes {
        id
        name
      }
      count
    }

    bannerFileUpload {
      postURL
      formData
      key
    }
  }
`;
