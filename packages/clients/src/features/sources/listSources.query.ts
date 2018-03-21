import gql from 'graphql-tag';

export default gql`
  query listSources($language:String) {
    sources(language: $language) {
      nodes {
        id
        language
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
