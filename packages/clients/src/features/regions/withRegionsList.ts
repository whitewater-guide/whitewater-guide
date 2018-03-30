import { graphql } from 'react-apollo';
import { Connection, Region } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import listRegions from './listRegions.query';

interface Props {
  language?: string;
}

interface Result {
  regions: Connection<Region>;
}

export interface WithRegionsList {
  regions: WithList<Region>;
}

export const withRegionsList = graphql<Props, Result, {}, WithRegionsList>(
  listRegions,
  {
    alias: 'withRegionsList',
    options: ({ language }) => ({
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      context: language ? { headers: { 'Accept-Language': language } } : undefined,
    }),
    props: props => queryResultToList(props, 'regions'),
  },
);
