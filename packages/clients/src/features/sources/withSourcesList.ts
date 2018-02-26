import { graphql } from 'react-apollo';
import { Connection, Source } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import listSources from './listSources.query';

interface Result {
  sources: Connection<Source>;
}

export interface WithSourcesList {
  sources: WithList<Source>;
}

export const withSourcesList = graphql<Result, any, WithSourcesList>(
  listSources,
  {
    alias: 'withSourcesList',
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => queryResultToList(props, 'sources'),
  },
);
