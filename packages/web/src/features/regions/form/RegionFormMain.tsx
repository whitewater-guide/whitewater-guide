import Grid from '@material-ui/core/Grid';
import React from 'react';

import { SeasonPickerField, TextField } from '../../../formik/fields';

const RegionFormMain: React.FC = () => {
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="name"
          label="Name"
          placeholder="Name"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="season"
          label="Season"
          placeholder="Season"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <SeasonPickerField name="seasonNumeric" />
      </Grid>
    </Grid>
  );
};

export default RegionFormMain;
