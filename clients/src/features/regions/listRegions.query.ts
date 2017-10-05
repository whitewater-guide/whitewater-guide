import { gql } from 'react-apollo';

export default gql`
  query listRegions($language:String) {
    regions(language: $language) {
      id
      language
      name
      hidden
      riversCount
      sectionsCount
    }
  }
`;
