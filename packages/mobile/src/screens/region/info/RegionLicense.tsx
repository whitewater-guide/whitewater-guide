import { useRegion } from '@whitewater-guide/clients';
import { ROOT_LICENSE } from '@whitewater-guide/commons';
import React, { FC } from 'react';

import LicenseBadge from '~/components/LicenseBadge';

const RegionLicense: FC = () => {
  const { node } = useRegion();
  return (
    <LicenseBadge
      divider
      placement="region"
      license={node?.license ?? ROOT_LICENSE}
      copyright={node?.copyright}
    />
  );
};

export default RegionLicense;
