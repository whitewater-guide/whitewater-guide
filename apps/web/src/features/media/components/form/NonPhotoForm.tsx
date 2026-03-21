import Grid from '@material-ui/core/Grid';
import React from 'react';

import { NumberField, TextField } from '../../../../formik/fields';
import { LicenseSubform } from '../../../license';

interface Props {
  prefix?: string;
}

const NonPhotoForm = React.memo<Props>(({ prefix = '' }) => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <TextField
        multiline
        fullWidth
        name={`${prefix}description`}
        label="Description"
        placeholder="Description"
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        name={`${prefix}url`}
        label="URL"
        placeholder="URL"
      />
    </Grid>

    <Grid item xs={12}>
      <NumberField
        fullWidth
        name={`${prefix}weight`}
        label="Sort weight"
        placeholder="Sort weight"
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        name={`${prefix}copyright`}
        label="Copyright"
        placeholder="Copyright"
      />
    </Grid>

    <LicenseSubform
      prefix={prefix}
      inheritLabel="Inherit license from section"
    />
  </Grid>
));

NonPhotoForm.displayName = 'NonPhotoForm';

export default NonPhotoForm;
