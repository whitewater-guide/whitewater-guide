import gql from 'graphql-tag';

const TOGGLE_ALL_GAUGES = gql`
  mutation toggleAllGauges($sourceId: ID!, $enabled: Boolean!){
    toggleAllGauges(sourceId: $sourceId, enabled: $enabled) {
      id
      language
      enabled
    }
  }
`;

export default TOGGLE_ALL_GAUGES;
