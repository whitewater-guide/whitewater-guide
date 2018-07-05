import React from 'react';
import { Markdown } from '../../../components';
import { WithSection } from '../../../ww-clients/features/sections';
import Placeholder from './placeholder';

const SectionGuideView: React.StatelessComponent<WithSection> = ({ section: { node } }) => (
  (node && node.description) ? <Markdown>{node.description}</Markdown> : <Placeholder/>
);

export default SectionGuideView;
