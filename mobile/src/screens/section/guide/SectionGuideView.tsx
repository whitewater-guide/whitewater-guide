import { WithNode } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import React from 'react';

import Markdown from '~/components/Markdown';

import Placeholder from './placeholder';

interface Props {
  section: WithNode<Section | null>;
}

// Priorities:
// section description is empty string when there is no description (even for premium)
// section description is null when premium is required
const SectionGuideView: React.FC<Props> = ({ section: { node } }) => {
  if (!node) {
    return null;
  }
  if (node.description) {
    return <Markdown>{node.description}</Markdown>;
  }
  return <Placeholder section={node} premium={node.description === null} />;
};

export default SectionGuideView;
