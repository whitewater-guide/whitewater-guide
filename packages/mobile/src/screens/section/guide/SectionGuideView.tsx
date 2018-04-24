import React from 'react';
import { Markdown } from '../../../components';
import { WithSection } from '../../../ww-clients/features/sections';
import NoSectionGuide from './NoSectionGuide';

const SectionGuideView: React.StatelessComponent<WithSection> = ({ section: { node } }) => (
  (node && node.description) ? <Markdown>{node.description}</Markdown> : <NoSectionGuide/>
);

export default SectionGuideView;
