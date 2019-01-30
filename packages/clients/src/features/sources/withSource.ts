import { Source } from '@whitewater-guide/commons';
import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import SOURCE_DETAILS from './sourceDetails.query';

interface Options {
  fetchPolicy?: FetchPolicy;
}

interface Result {
  source: Source;
}

interface Vars {
  sourceId: string;
}

type Props = Vars;

interface ChildProps {
  source: WithNode<Source>;
}

export type WithSource = Props & ChildProps;

export const withSource = ({
  fetchPolicy = 'cache-and-network',
}: Options = {}) =>
  compose<WithSource, any>(
    withFeatureIds('source'),
    graphql<Props, Result, Vars, ChildProps>(SOURCE_DETAILS, {
      alias: 'withSource',
      options: () => ({ fetchPolicy }),
      props: (props) => queryResultToNode(props, 'source'),
    }),
  );
