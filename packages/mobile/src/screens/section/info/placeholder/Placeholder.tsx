import { SafeSectionDetails } from '@whitewater-guide/clients';
import React from 'react';

import { useIap } from '~/features/purchases';

import NoDataPlaceholder from './NoDataPlaceholder';
import PremiumPlaceholder from './PremiumPlaceholder';

interface Props {
  premium: boolean;
  section: SafeSectionDetails;
}

const Placeholder: React.FC<Props> = ({ premium, section }) => {
  const { canMakePayments } = useIap();
  return premium && canMakePayments ? (
    <PremiumPlaceholder section={section} />
  ) : (
    <NoDataPlaceholder />
  );
};

export default Placeholder;
