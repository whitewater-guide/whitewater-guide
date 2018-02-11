import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, Section } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import { LIST_SECTIONS } from './listSections.query';

export interface WithSectionsListOptions {
  fetchPolicy?: FetchPolicy;
}

export interface WithSectionsListResult {
  sections: Connection<Section>;
}

export interface WithSectionsList {
  sections: WithList<Section>;
  regionId?: string;
}

export const withSectionsList = ({ fetchPolicy = 'cache-and-network' }: WithSectionsListOptions = {}) =>
  compose(
    withFeatureIds('region'),
    graphql<WithSectionsListResult, any, WithSectionsList>(
      LIST_SECTIONS,
      {
        alias: 'withSectionsList',
        options: (props) => ({
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
          variables: {
            language: props.langauge,
            filter: { regionId: props.regionId },
            // page ?
          },
        }),
        props: props => queryResultToList(props, 'sections'),
      },
    ),
  );
