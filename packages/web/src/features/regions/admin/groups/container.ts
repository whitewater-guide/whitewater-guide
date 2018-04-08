import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withLoading } from '../../../../components';
import { withFeatureIds } from '../../../../ww-clients/core';
import { ADD_REGION_TO_GROUP_MUTATION, AddGroupProps, AddGroupVars } from './addRegionToGroup.mutation';
import {
  REGION_GROUPS_QUERY,
  RegionGroupsQueryProps,
  RegionGroupsResult,
  RegionGroupsVars,
} from './regionGroups.query';
import {
  REMOVE_REGION_FROM_GROUP_MUTATION,
  RemoveGroupVars,
  RemoverGroupProps,
} from './removeRegionFromGroup.mutation';

const regionGroupsContainer = compose<RegionGroupsQueryProps & RemoverGroupProps & AddGroupProps, any>(
  withRouter,
  withFeatureIds('region'),
  graphql<{regionId: string}, RegionGroupsResult, RegionGroupsVars, RegionGroupsQueryProps>(
    REGION_GROUPS_QUERY,
    {
      options: () => ({ fetchPolicy: 'cache-and-network' }),
      props: ({ data }) => {
        const { regionGroups, allGroups, loading } = data!;
        return { regionGroups: regionGroups!, allGroups: allGroups!, groupsLoading: loading };
      },
    },
  ),
  withLoading<RegionGroupsQueryProps>(props => props.groupsLoading),
  graphql<{regionId: string}, {}, AddGroupVars, AddGroupProps>(
    ADD_REGION_TO_GROUP_MUTATION,
    {
      props: ({ mutate, ownProps: { regionId } }) => ({
        addGroup: (groupId: string) => mutate!({
          variables: { groupId, regionId },
          refetchQueries: ['regionGroups'],
        }),
      }),
    },
  ),
  graphql<{regionId: string}, {}, RemoveGroupVars, RemoverGroupProps>(
    REMOVE_REGION_FROM_GROUP_MUTATION,
    {
      props: ({ mutate, ownProps: { regionId } }) => ({
        removeGroup: (groupId: string) => mutate!({
          variables: { groupId, regionId },
          refetchQueries: ['regionGroups'],
        }),
      }),
    },
  ),
);

export default regionGroupsContainer;
