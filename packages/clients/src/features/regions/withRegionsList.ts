import { graphql } from 'react-apollo';
import { Connection, Region } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import listRegions from './listRegions.query';

export interface WithRegionsListResult {
  regions: Connection<Region>;
}

export interface WithRegionsList {
  regions: WithList<Region>;
}

export const withRegionsList = graphql<WithRegionsListResult, any, WithRegionsList>(
  listRegions,
  {
    alias: 'withRegionsList',
    options: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    props: props => queryResultToList(props, 'regions'),
  },
);
