import { graphql } from 'react-apollo';
import { Group } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { LIST_GROUPS } from './listGroups.query';

interface Result {
  groups: Group[];
}

export interface WithGroupsList {
  groups: WithList<Group>;
}

export const withGroups = graphql<any, Result, any, WithGroupsList>(
  LIST_GROUPS,
  {
    options: () => ({
      fetchPolicy: 'network-only',
    }),
    props: props => queryResultToList(props, 'groups'),
  },
);
