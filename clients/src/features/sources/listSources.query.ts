import { gql } from 'react-apollo';

export default gql`
  query listSources($language:String) {
    sources(language: $language) {
      id
      language
      name
      harvestMode
      enabled
    }
  }
`;
