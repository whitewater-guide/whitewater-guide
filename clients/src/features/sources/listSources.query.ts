import { gql } from 'react-apollo';

export default gql`
  query listSources($language:String) {
    sources(language: $language) {
      nodes {
        id
        language
        name
        harvestMode
        enabled
        gauges {
          count
        }
      }
      count
    }
  }
`;
