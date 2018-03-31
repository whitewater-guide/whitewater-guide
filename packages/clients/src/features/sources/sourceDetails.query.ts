import gql from 'graphql-tag';

export default gql`
  query sourceDetails($sourceId: ID!) {
    source(id: $sourceId) {
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      url
      enabled
      regions {
        nodes {
          id
          name
        }
      }
    }
  }
`;
