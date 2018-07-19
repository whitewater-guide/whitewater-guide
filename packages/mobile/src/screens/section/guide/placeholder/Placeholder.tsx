import React from 'react';
import { connectPremiumDialog, WithPremiumDialog } from '../../../../features/purchases';
import { Section } from '../../../../ww-commons';
import NoDataPlaceholder from './NoDataPlaceholder';
import PremiumPlaceholder from './PremiumPlaceholder';

interface Props extends WithPremiumDialog {
  premium: boolean;
  section: Section;
}

const Placeholder: React.SFC<Props> = ({ canMakePayments, buyRegion, premium, section }) =>
  (premium && canMakePayments) ?
    <PremiumPlaceholder section={section} canMakePayments={canMakePayments} buyRegion={buyRegion} /> :
    <NoDataPlaceholder />;

export default connectPremiumDialog(Placeholder);
