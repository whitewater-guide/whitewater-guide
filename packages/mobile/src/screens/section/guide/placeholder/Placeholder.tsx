import React from 'react';
import NoDataPlaceholder from './NoDataPlaceholder';
import PremiumPlaceholder from './PremiumPlaceholder';

interface Props {
  premium: boolean;
}

const Placeholder: React.SFC<Props> = ({ premium }) =>
  premium ? <PremiumPlaceholder /> : <NoDataPlaceholder />;

export default Placeholder;
