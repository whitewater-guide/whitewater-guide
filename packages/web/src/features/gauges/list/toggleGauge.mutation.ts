import gql from 'graphql-tag';

const TOGGLE_GAUGE = gql`
  mutation toggleGauge($id: ID!, $enabled: Boolean!){
    toggleGauge(id: $id, enabled: $enabled) {
      id
      language
      enabled
    }
  }
`;

export default TOGGLE_GAUGE;