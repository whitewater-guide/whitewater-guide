import { ROOT_LICENSE, useRegion } from '@whitewater-guide/clients';

import LicenseBadge from '../../../components/LicenseBadge';

function RegionLicense() {
  const region = useRegion();
  return (
    <LicenseBadge
      divider
      placement="region"
      license={region?.license ?? ROOT_LICENSE}
      copyright={region?.copyright}
    />
  );
}

export default RegionLicense;
