import Grid from '@material-ui/core/Grid';
import React from 'react';

import { NumberField, TextField } from '../../../../formik/fields';
import { LicenseSubform } from '../../../license';

interface Props {
  prefix?: string;
}

const NonPhotoForm: React.FC<Props> = React.memo(({ prefix = '' }) => {
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <TextField
          multiline={true}
          fullWidth={true}
          name={`${prefix}description`}
          label="Description"
          placeholder="Description"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name={`${prefix}url`}
          label="URL"
          placeholder="URL"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <NumberField
          fullWidth={true}
          name={`${prefix}weight`}
          label="Sort weight"
          placeholder="Sort weight"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
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
  );
});

NonPhotoForm.displayName = 'NonPhotoForm';

export default NonPhotoForm;
