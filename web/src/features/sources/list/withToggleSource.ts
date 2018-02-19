import { graphql } from 'react-apollo';
import TOGGLE_SOURCE from './toggleSource.mutation';

export interface WithToggleSource {
  toggleSource: (id: string, enabled: boolean) => Promise<any>;
}

export default graphql(
  TOGGLE_SOURCE,
  {
    props: ({ mutate }) => ({
      toggleSource: (id: string, enabled: boolean) => mutate!({ variables: { id, enabled } }),
    }),
  },
);
