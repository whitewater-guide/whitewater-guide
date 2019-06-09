import { Section } from '@whitewater-guide/commons';
import { WatchQueryFetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { SECTION_DETAILS } from './sectionDetails.query';

interface Options {
  fetchPolicy?: WatchQueryFetchPolicy;
}

interface Result {
  section: Section;
}

interface Vars {
  sectionId: string;
}

type Props = Vars;

export interface WithSection {
  section: WithNode<Section | null>;
}

export const withSection = ({
  fetchPolicy = 'cache-and-network',
}: Options = {}) =>
  compose<WithSection, any>(
    withFeatureIds('section'),
    graphql<Props, Result, Vars, WithSection>(SECTION_DETAILS, {
      alias: 'withSection',
      options: () => ({ fetchPolicy }),
      props: (props) => queryResultToNode(props, 'section'),
    }),
  );
