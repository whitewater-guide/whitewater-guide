import { WithSection } from '@whitewater-guide/clients';
import Markdown from 'components/Markdown';
import React from 'react';
import Placeholder from './placeholder';

// Priorities:
// section description is empty string when there is no description (even for premium)
// section description is null when premium is required
const SectionGuideView: React.FC<WithSection> = ({ section: { node } }) => {
  if (!node) {
    return null;
  }
  if (node.description) {
    return <Markdown>{node.description}</Markdown>;
  }
  return <Placeholder section={node} premium={node.description === null} />;
};

export default SectionGuideView;
