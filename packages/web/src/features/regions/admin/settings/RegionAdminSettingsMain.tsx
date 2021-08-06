import Grid from '@material-ui/core/Grid';
import React from 'react';

import {
  CheckboxField,
  ImageUploadField,
  NumberField,
  TextField,
} from '../../../../formik/fields';
import { COVER_IMAGE_RESOLUTION } from './constants';

const RegionAdminSettingsMain: React.FC = React.memo(() => (
  <Grid container>
    <Grid item xs={12}>
      <CheckboxField name="hidden" label="Hidden" />
    </Grid>
    <Grid item xs={12}>
      <CheckboxField name="premium" label="Premium" />
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth name="sku" label="SKU" placeholder="SKU" />
    </Grid>
    <Grid item xs={12}>
      <NumberField
        fullWidth
        name="mapsSize"
        label="Maps size (bytes)"
        placeholder="Maps size (bytes)"
      />
    </Grid>
    <Grid item xs={12}>
      <ImageUploadField
        title="Cover image for mobile (2048x682)"
        name="coverImage"
        width={COVER_IMAGE_RESOLUTION[0]}
        height={COVER_IMAGE_RESOLUTION[1]}
        previewScale={0.2}
        mpxOrResolution={COVER_IMAGE_RESOLUTION}
      />
    </Grid>
  </Grid>
));

RegionAdminSettingsMain.displayName = 'RegionAdminSettingsMain';

export default RegionAdminSettingsMain;
