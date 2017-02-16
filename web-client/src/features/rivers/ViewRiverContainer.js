import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withFeatureIds} from '../../core/hoc';

const ViewRiverQuery = gql`
  query viewRiver($riverId:ID!, $language: String) {
    river(_id:$riverId, language:$language) {
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
  withFeatureIds('river'),
  graphql(
    ViewRiverQuery, {
      props: ({data: {river, loading}}) => ({river, loading}),
    }
  ),
);