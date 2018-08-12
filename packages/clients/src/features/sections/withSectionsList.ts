import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, Section } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import { LIST_SECTIONS } from './listSections.query';

interface Options {
  fetchPolicy?: FetchPolicy;
}

interface Result {
  sections: Connection<Section>;
}

interface Vars {
  filter: {
    regionId: string;
  };
}

interface Props {
  regionId: string;
}

interface ChildProps {
  sections: WithList<Section>;
}

export type WithSectionsList = Props & ChildProps;

export const withSectionsList = ({ fetchPolicy = 'cache-and-network' }: Options = {}) =>
  compose<WithSectionsList, any>(
    withFeatureIds('region'),
    graphql<Props, Result, Vars, ChildProps>(
      LIST_SECTIONS,
      {
        alias: 'withSectionsList',
        options: (props) => ({
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
          variables: {
            filter: { regionId: props.regionId },
            page: { limit: 20 },
          },
        }),
        props: props => queryResultToList(props, 'sections'),
      },
    ),
  );
