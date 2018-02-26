import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Section } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { SECTION_DETAILS } from './sectionDetails.query';

interface WithSectionOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithSectionResult {
  section: Section;
  sectionId: string;
}

interface WithSectionProps {
  sectionId: string;
}

export interface WithSection {
  section: WithNode<Section>;
  sectionId: string;
}

export const withSection = ({ fetchPolicy = 'cache-and-network' }: WithSectionOptions = {}) =>
  compose<WithSection, any>(
    withFeatureIds('section'),
    graphql<WithSectionResult, WithSectionProps, WithSection>(
      SECTION_DETAILS,
      {
        alias: 'withSection',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'section'),
      },
    ),
  );
