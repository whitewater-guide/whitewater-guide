import gql from 'graphql-tag';

const TOGGLE_ALL_GAUGES = gql`
  mutation toggleAllGauges(
    $sourceId: ID!
    $enabled: Boolean!
    $linkedOnly: Boolean
  ) {
    toggleAllGauges(
      sourceId: $sourceId
      enabled: $enabled
      linkedOnly: $linkedOnly
    ) {
      id
      enabled
    }
  }
`;

export default TOGGLE_ALL_GAUGES;
