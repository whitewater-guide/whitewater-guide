import gql from 'graphql-tag';

const REMOVE_ALL_GAUGES = gql`
  mutation removeGauges($sourceId: ID!) {
    removeGauges(sourceId: $sourceId)
  }
`;

export default REMOVE_ALL_GAUGES;
