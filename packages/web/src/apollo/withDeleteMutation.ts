import { DocumentNode } from 'graphql';
import { graphql } from 'react-apollo';
import { compose, withState } from 'recompose';
import { withLoading } from '../components';

interface WithMutationState {
  mutating: boolean;
  setMutating: (value: boolean) => void;
}

type MutationResult = string | null;

export type WithDeleteMutation<T extends string> = {
  [propName in T]: (id: string) => void;
};

interface Options<PropName extends string> {
  mutation: DocumentNode;
  refetchQueries?: string[];
  propName: PropName;
}

export const withDeleteMutation = <PropName extends string>(options: Options<PropName>) => {
  const { mutation, refetchQueries = [], propName } = options;

  return compose<WithDeleteMutation<PropName>, any>(
    withState('mutating', 'setMutating', false),
    graphql<MutationResult, WithMutationState, WithDeleteMutation<PropName>>(mutation, {
      alias: 'withDeleteMutation',
      props: ({ mutate, ownProps }) => ({
        [propName]: (id: string) => {
          ownProps.setMutating(true);
          return mutate!({
            variables: { id },
            refetchQueries,
          })
            .then((result) => {
              ownProps.setMutating(false);
              return result;
            })
            .catch((err) => {
              ownProps.setMutating(false);
            });
        },
      }),
    }),
    withLoading<WithMutationState>(props => props.mutating),
  );
};
