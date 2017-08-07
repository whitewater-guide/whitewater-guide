import { gql } from 'react-apollo';
import { ComponentEnhancer, compose } from 'recompose';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core/withFeatureIds';
import { River } from './types';

const riverDetails = gql`
  query riverDetails($riverId:ID!, $language: String) {
    river(_id:$riverId, language:$language) {
      id
      name
      description,
      sections {
        id
        name
        difficulty
        difficultyXtra
        rating
        drop
        distance
        duration
        river {
          id
          name
        }
      }
    }
  }
`;

export interface WithRiverResult {
  river: River | null;
}

export interface WithRiverChildProps {
  river: River | null;
  riverLoading: boolean;
}

export interface WithRiverProps {
  riverId?: string;
  language?: string;
}

/**
 *
 * @param options.withSections (true) = Should include all sections
 * @returns High-order component
 */
export function withRiver() {
  return compose<WithRiverChildProps, any>(
    withFeatureIds('river'),
    enhancedQuery<WithRiverResult, WithRiverProps, WithRiverChildProps>(
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

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentEnhancer<any, any>;
