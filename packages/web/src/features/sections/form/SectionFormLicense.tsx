import Grid from '@material-ui/core/Grid';
import { License } from '@whitewater-guide/commons';
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
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
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
