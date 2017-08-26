import { gql } from 'react-apollo';

export default gql`
  query listRegions {
    regions {
      id
      name
      hidden
      riversCount
      sectionsCount
    }
  }
`;
