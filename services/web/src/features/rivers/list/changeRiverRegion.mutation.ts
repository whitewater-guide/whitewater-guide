import gql from 'graphql-tag';

const CHANGE_REGION = gql`
  mutation ChangeRiverRegion($riverId: ID!, $regionId: ID!) {
    changeRiverRegion(riverId: $riverId, regionId: $regionId) {
      id
      region {
        id
      }
    }
  }
`;

export default CHANGE_REGION;
