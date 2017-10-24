import { gql } from 'react-apollo';

export default gql`
  query sourceForm($sourceId: ID, $language: String) {
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

    regions(language: $language) {
      nodes {
        id
        language
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
