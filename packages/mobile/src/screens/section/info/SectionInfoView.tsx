import React from 'react';
import { Markdown } from '../../../components';
import { WithSection } from '../../../ww-clients/features/sections';
import NoSectionDescription from './NoSectionDescription';

const SectionInfoView: React.StatelessComponent<WithSection> = ({ section: { node } }) => (
  (node && node.description) ? <Markdown>{node.description}</Markdown> : <NoSectionDescription/>
);

export default SectionInfoView;
