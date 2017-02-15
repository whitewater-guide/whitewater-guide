import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const sourceTermOfUse = gql`
  query sourceTermOfUse($_id: ID, $language:String) {
    source(_id: $_id, language: $language) {
      _id
      termsOfUse
    }
  }
`;


export default graphql(
  sourceTermOfUse,
  {
    options: ({match: {params: {sourceId}}, language}) => ({
      variables: {_id: sourceId, language},
    }),
    props: ({data: {source}}) => {
      return {source};
    },
  }
);