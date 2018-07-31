import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { queryResultToNode, WithNode } from '../../ww-clients/apollo';
import { withFeatureIds } from '../../ww-clients/core';
import { withSection } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';
import { Result, SECTION_DETAILS, Vars } from './sectionDetails.query';
import { InnerProps, OuterProps } from './types';

type Props = Vars;

interface ChildProps {
  section: WithNode<Section>;
}

export default compose<InnerProps & OuterProps, OuterProps>(
  withFeatureIds('section'),
  graphql<Props, Result, Vars, ChildProps>(
    SECTION_DETAILS,
    {
      alias: 'withSection',
      options: () => ({ fetchPolicy: 'cache-and-network' }),
      props: (props) => queryResultToNode(props, 'section'),
    },
  ),
);
