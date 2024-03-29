import { ROOT_LICENSE, useRegion } from '@whitewater-guide/clients';
import type { FC } from 'react';
import React from 'react';

import LicenseBadge from '~/components/LicenseBadge';

const RegionLicense: FC = () => {
  const region = useRegion();
  return (
    <LicenseBadge
      divider
      placement="region"
      license={region?.license ?? ROOT_LICENSE}
      copyright={region?.copyright}
    />
  );
};

export default RegionLicense;
