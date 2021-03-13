import { useSection } from '@whitewater-guide/clients';
import { ROOT_LICENSE } from '@whitewater-guide/commons';
import React, { FC } from 'react';

import LicenseBadge from '~/components/LicenseBadge';

const SectionLicense: FC = () => {
  const { node } = useSection();
  return (
    <LicenseBadge
      divider
      placement="section"
      license={node?.license ?? node?.region?.license ?? ROOT_LICENSE}
      copyright={node?.copyright}
    />
  );
};

export default SectionLicense;
