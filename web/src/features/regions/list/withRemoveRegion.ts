import { graphql } from 'react-apollo';
import { compose, withState } from 'recompose';
import { withLoading } from '../../../components';
import REMOVE_REGION from './removeRegion.mutation';

interface WithMutationState {
  removingRegion: boolean;
  setRemovingRegion: (value: boolean) => void;
}

type MutationResult = string | null;

export interface WithRemoveRegion {
  removeRegion: (id: string) => void;
}

export default compose<WithRemoveRegion, any>(
  withState('removingRegion', 'setRemovingRegion', false),
  graphql<MutationResult, WithMutationState, WithRemoveRegion>(REMOVE_REGION, {
    alias: 'withRemoveRegion',
    props: ({ mutate, ownProps }) => ({
      removeRegion: (id: string) => {
        ownProps.setRemovingRegion(true);
        return mutate!({ variables: { id } })
          .then(() => ownProps.setRemovingRegion(false))
          .catch(() => ownProps.setRemovingRegion(false));
      },
    }),
  }),
  withLoading<WithMutationState>(props => props.removingRegion),
);
