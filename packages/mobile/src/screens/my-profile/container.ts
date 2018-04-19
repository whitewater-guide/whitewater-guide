import { graphql } from 'react-apollo';
import { translate } from 'react-i18next';
import { compose } from 'recompose';
import { WithMe, withMe } from '../../ww-clients/features/users';
import { UserInput } from '../../ww-commons';
import { InnerProps, WithMutation } from './types';
import { Result, UPDATE_MY_PROFILE, Vars } from './updateProfile.mutation';

const container = compose<InnerProps, {}>(
  translate(),
  withMe,
  graphql<WithMe, Result, Vars, WithMutation>(
    UPDATE_MY_PROFILE,
    {
      props: ({ mutate, ownProps: { me } }) => ({
        updateMyProfile: (user: UserInput) => mutate({
          variables: { user },
          optimisticResponse: {
            __typename: 'Mutation',
            updateProfile: { ...me, ...user },
            // TODO: reset cache on language change??
          },
        }),
      }),
    },
  ),
);

export default container;