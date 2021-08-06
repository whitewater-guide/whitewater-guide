import Grid from '@material-ui/core/Grid';
import React from 'react';

import { TextField } from '../../../formik/fields';
import { LicenseSubform } from '../../license';

const RegionFormLicense: React.FC = React.memo(() => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        name="copyright"
        label="Copyright"
        placeholder="Copyright"
      />
    </Grid>

    <LicenseSubform inheritLabel="Inherit license from app (CC BY 4.0)" />
  </Grid>
));

RegionFormLicense.displayName = 'RegionFormLicense';

export default RegionFormLicense;
