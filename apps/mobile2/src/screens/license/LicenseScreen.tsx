import type { License } from '@whitewater-guide/schema';

import LicenseBadge from '../../components/LicenseBadge';
import Screen from '../../components/Screen';
import type { LicenseScreenProps } from './navigation-types';

function LicenseScreen({ route }: LicenseScreenProps) {
  const { placement, copyright, license } = route.params;
  return (
    <Screen padding>
      <LicenseBadge
        placement={placement as 'region' | 'section' | 'media'}
        copyright={copyright}
        license={license as License}
      />
    </Screen>
  );
}

export default LicenseScreen;
