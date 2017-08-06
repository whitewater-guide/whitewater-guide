import { gql } from 'react-apollo';
import { compose } from 'recompose';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core/withFeatureIds';
import riverReducer from './riverReducer';

const riverDetails = gql`
  query riverDetails($riverId:ID!, $language: String) {
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

/**
 *
 * @param options.withSections (true) = Should include all sections
 * @returns High-order component
 */
export function withRiver() {
  return compose(
    withFeatureIds('river'),
    enhancedQuery(
      riverDetails,
      {
        options: ({ riverId, language }) => ({
          fetchPolicy: 'cache-and-network',
          variables: { riverId, language },
          reducer: riverReducer,
          notifyOnNetworkStatusChange: true,
        }),
        props: ({ data: { river, loading } }) => (
          { river, riverLoading: loading && !river }
        ),
      },
    ),
  );
}
