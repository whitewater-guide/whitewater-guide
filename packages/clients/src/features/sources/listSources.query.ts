import gql from 'graphql-tag';

export default gql`
  query listSources {
    sources {
      nodes {
        id
        name
        harvestMode
        enabled
        cron
        gauges {
          count
        }
        status {
          success
          count
          timestamp
          error
        }
      }
      count
    }
  }
`;
