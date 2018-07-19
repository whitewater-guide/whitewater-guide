import React from 'react';
import { Markdown } from '../../../components';
import { WithSection } from '../../../ww-clients/features/sections';
import Placeholder from './placeholder';

// Priorities:
// section description is empty string when there is no description (even for premium)
// section description is null when premium is required
const SectionGuideView: React.StatelessComponent<WithSection> = ({ section: { node } }) => (
  (node && node.description) ?
    <Markdown>{node.description}</Markdown> :
    <Placeholder section={node} premium={node && node.description === null} />
);

export default SectionGuideView;
