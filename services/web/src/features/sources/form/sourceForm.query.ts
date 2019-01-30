import gql from 'graphql-tag';

export default gql`
  query sourceForm($sourceId: ID) {
    source(id: $sourceId) {
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      url
      regions {
        nodes {
          id
          name
        }
      }
    }

    regions {
      nodes {
        id
        name
      }
      count
    }

    scripts {
      id
      name
      harvestMode
      error
    }
  }
`;
