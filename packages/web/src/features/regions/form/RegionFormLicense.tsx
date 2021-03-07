import Grid from '@material-ui/core/Grid';
import React from 'react';

import { TextField } from '../../../formik/fields';
import { LicenseSubform } from '../../license';

const RegionFormLicense: React.FC = React.memo(() => {
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

      <LicenseSubform inheritLabel="Inherit license from app (CC BY 4.0)" />
    </Grid>
  );
});

RegionFormLicense.displayName = 'RegionFormLicense';

export default RegionFormLicense;
