import { gql } from 'react-apollo';

export default gql`
  query listScripts {
    scripts {
      script
      harvestMode
      error
    }
  }
`;
