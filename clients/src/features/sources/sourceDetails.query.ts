import gql from 'graphql-tag';

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
