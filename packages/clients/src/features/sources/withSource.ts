import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Source } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import SOURCE_DETAILS from './sourceDetails.query';

interface WithSourceOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithSourceResult {
  source: Source;
  sourceId: string;
}

interface WithSourceProps {
  sourceId: string;
}

export interface WithSource {
  source: WithNode<Source>;
  sourceId: string;
}

export const withSource = ({ fetchPolicy = 'cache-and-network' }: WithSourceOptions = {}) =>
  compose<WithSource, any>(
    withFeatureIds('source'),
    graphql<WithSourceResult, WithSourceProps, WithSource>(
      SOURCE_DETAILS,
      {
        alias: 'withSource',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'source'),
      },
    ),
  );
