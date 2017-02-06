import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {mapProps} from 'recompose';

//TODO: include section in query, so that sections list doesn't have to make own request
const ViewRiverQuery = gql`
  query viewRiver($_id:ID!, $language: String) {
    river(_id:$_id, language:$language) {
      _id
      name
      description,
      sections {
        _id
        name
        difficulty
        rating
        drop
        distance
        duration
        river {
          _id
          name
        }
      }
    }
  }
`;

export default compose(
  mapProps(({params, ...props}) => ({
    ...props,
    _id: params.riverId,
  })),
  graphql(
    ViewRiverQuery, {
      props: ({data: {river, loading}}) => ({river, loading}),
    }
  ),
);