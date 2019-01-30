import gql from 'graphql-tag';

const TOGGLE_ALL_GAUGES = gql`
  mutation toggleAllGauges($sourceId: ID!, $enabled: Boolean!) {
    toggleAllGauges(sourceId: $sourceId, enabled: $enabled) {
      id
      enabled
    }
  }
`;

export default TOGGLE_ALL_GAUGES;
