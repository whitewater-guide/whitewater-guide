import { gql } from 'react-apollo';
import { compose } from 'recompose';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core/withFeatureIds';
import { River } from './types';

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

interface Result {
  river: River | null;
}

interface ChildProps {
  river: River | null;
  riverLoading: boolean;
}

interface Props {
  riverId?: string;
  language?: string;
}

/**
 *
 * @param options.withSections (true) = Should include all sections
 * @returns High-order component
 */
export function withRiver() {
  return compose<ChildProps, any>(
    withFeatureIds('river'),
    enhancedQuery<Result, Props, ChildProps>(
      riverDetails,
      {
        options: ({ riverId, language }) => ({
          fetchPolicy: 'cache-and-network',
          variables: { riverId, language },
          // reducer: riverReducer,
          notifyOnNetworkStatusChange: true,
        }),
        props: ({ data }) => {
          const { river, loading } = data!;
          return { river, riverLoading: loading && !river };
        },
      },
    ),
  );
}
