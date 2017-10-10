import { gql } from 'react-apollo';

export default gql`
  query listScripts {
    scripts {
      id
      name
      harvestMode
      error
    }
  }
`;
