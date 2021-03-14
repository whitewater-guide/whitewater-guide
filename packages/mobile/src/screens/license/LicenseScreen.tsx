import React from 'react';

import LicenseBadge from '~/components/LicenseBadge';
import { Screen } from '~/components/Screen';

import { LicenseNavProps } from './types';

const LicenseScreen: React.FC<LicenseNavProps> = ({ route }) => {
  const { placement, copyright, license } = route.params;
  return (
    <Screen padding>
      <LicenseBadge
        placement={placement}
        copyright={copyright}
        license={license}
      />
    </Screen>
  );
};

export default LicenseScreen;
