import { graphql } from 'react-apollo';
import { Group, WithGroups } from '../../../ww-commons';
import { LIST_GROUPS } from './listGroups.query';

interface Result {
  groups: Group[];
}

export const withGroups = graphql<any, Result, any, WithGroups>(
  LIST_GROUPS,
  {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: ({ data }) => {
      const { loading, groups } = data!;
      return { groups: groups!, groupsLoading: loading };
    },
  },
);
