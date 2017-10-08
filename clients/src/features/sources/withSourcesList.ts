import { Source } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import listSources from './listSources.query';

interface Result {
  sources: Source[];
}

export interface SourcesList {
  list: Source[];
  loading: boolean;
  refetch: () => void;
}

export interface WithSourcesList {
  sources: SourcesList;
}

export const withSourcesList = enhancedQuery<Result, any, WithSourcesList>(
  listSources,
  {
    options: ({ language }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { language },
    }),
    props: ({ data }) => {
      const { sources, loading, refetch } = data!;
      return { sources: { list: sources || [], loading, refetch } };
    },
    alias: 'withSourcesList',
  },
);
