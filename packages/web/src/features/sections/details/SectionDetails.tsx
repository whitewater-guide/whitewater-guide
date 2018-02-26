import * as React from 'react';
import { WithSection } from '../../../ww-clients/features/sections';

const SectionDetails: React.StatelessComponent<WithSection> = props => (
  <div>
    <span>{props.section.node.name}</span>
  </div>
);

export default SectionDetails;
