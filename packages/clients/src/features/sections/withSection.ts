import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Section } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { SECTION_DETAILS } from './sectionDetails.query';

interface Options {
  fetchPolicy?: FetchPolicy;
}

interface Result {
  section: Section;
}

interface Vars {
  sectionId: string;
}

type Props = Vars;

interface ChildProps {
  section: WithNode<Section>;
}

export type WithSection = ChildProps;

export const withSection = ({ fetchPolicy = 'cache-and-network' }: Options = {}) =>
  compose<WithSection, any>(
    withFeatureIds('section'),
    graphql<Props, Result, Vars, ChildProps>(
      SECTION_DETAILS,
      {
        alias: 'withSection',
        options: () => ({ fetchPolicy }),
        props: props => queryResultToNode(props, 'section'),
      },
    ),
  );
