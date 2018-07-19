import React from 'react';
import { Section } from '../../../../ww-commons';
import NoDataPlaceholder from './NoDataPlaceholder';
import PremiumPlaceholder from './PremiumPlaceholder';

interface Props {
  premium: boolean;
  section: Section;
}

const Placeholder: React.SFC<Props> = ({ premium, section }) =>
  premium ? <PremiumPlaceholder section={section} /> : <NoDataPlaceholder />;

export default Placeholder;
