import gql from 'graphql-tag';

export default gql`
  query sourceDetails($id: ID!, $language:String) {
    source(id: $id, language: $language) {
      id
      name
      language
      termsOfUse
      script
      cron
      harvestMode
      url
      enabled
    }
  }
`;
