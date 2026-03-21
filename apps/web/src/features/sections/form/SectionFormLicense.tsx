import Grid from '@material-ui/core/Grid';
import type { License } from '@whitewater-guide/schema';
import React from 'react';

import { TextField } from '../../../formik/fields';
import { LicenseSubform } from '../../license';

interface Props {
  regionLicense?: License | null;
}

const SectionFormLicense = React.memo<Props>(({ regionLicense }) => {
  const inheritLabel = regionLicense?.name
    ? `Inherit license from region (${regionLicense.name})`
    : 'Inherit license from app (CC BY 4.0)';
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="copyright"
          label="Copyright"
          placeholder="Copyright"
        />
      </Grid>

      <LicenseSubform inheritLabel={inheritLabel} />
    </Grid>
  );
});

SectionFormLicense.displayName = 'SectionFormLicense';

export default SectionFormLicense;
