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
    options: ({params, language}) => ({
      variables: {_id: params.sourceId, language},
    }),
    props: ({data: {source}}) => {
      return {source};
    },
  }
);