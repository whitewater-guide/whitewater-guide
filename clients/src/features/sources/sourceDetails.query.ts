import { gql } from 'react-apollo';

export default gql`
  query sourceDetails($sourceId: ID!, $language:String) {
    source(id: $sourceId, language: $language) {
      id
      name
      language
      termsOfUse
      script
      cron
      harvestMode
      url
      enabled
      regions {
        nodes {
          id
          language
          name
        }
      }
    }
  }
`;
