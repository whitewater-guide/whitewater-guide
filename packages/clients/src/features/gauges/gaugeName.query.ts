import gql from 'graphql-tag';

export const GAUGE_NAME = gql`
  query gaugeName($id: ID!, $language:String) {
    gauge(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
