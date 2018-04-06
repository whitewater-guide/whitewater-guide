import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withLoading } from '../../components';
import { withGroups } from '../../ww-clients/features/groups';
import { GroupInput, WithGroups } from '../../ww-commons';
import { REMOVE_GROUP } from './removeGroup.mutation';
import { GroupsFormProps } from './types';
import { UPSERT_GROUP } from './upsertGroup.mutation';

export default compose<GroupsFormProps, any>(
  withRouter,
  withGroups,
  withLoading<WithGroups>(props => props.groupsLoading),
  graphql(
    UPSERT_GROUP,
    {
      alias: 'UpsertGroupMutation',
      props: ({ mutate }) => ({
        upsertGroup: (group: GroupInput) => mutate!({
          variables: { group },
          refetchQueries: ['listGroups'],
        }),
      }),
    },
  ),
  graphql(
    REMOVE_GROUP,
    {
      alias: 'RemoveGroupMutation',
      props: ({ mutate }) => ({
        removeGroup: (id: string) => mutate!({
          variables: { id },
          refetchQueries: ['listGroups'],
        }),
      }),
    },
  ),
);