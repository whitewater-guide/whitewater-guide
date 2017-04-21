import { gql, graphql, compose } from 'react-apollo';
import { withFeatureIds } from '../../commons/core';
import { withAdmin } from '../users';

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
        difficultyXtra
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
  withAdmin(),
  withFeatureIds('river'),
  graphql(
    ViewRiverQuery, {
      props: ({ data: { river, loading } }) => ({ river, loading }),
    },
  ),
);
