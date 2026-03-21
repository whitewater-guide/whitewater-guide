import Grid from '@material-ui/core/Grid';
import React from 'react';

import { SeasonPickerField, TextField } from '../../../formik/fields';

const RegionFormMain: React.FC = () => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <TextField fullWidth name="name" label="Name" placeholder="Name" />
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth name="season" label="Season" placeholder="Season" />
    </Grid>
    <Grid item xs={12}>
      <SeasonPickerField name="seasonNumeric" />
    </Grid>
  </Grid>
);

export default RegionFormMain;
