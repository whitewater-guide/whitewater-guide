import Grid from '@material-ui/core/Grid';
import React from 'react';
import {
  CheckboxField,
  ImageUploadField,
  NumberField,
  TextField,
} from '../../../../formik/fields';
import { COVER_IMAGE_RESOLUTION } from './constants';

const RegionAdminSettingsMain: React.FC = React.memo(() => {
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <CheckboxField name="hidden" label="Hidden" />
      </Grid>
      <Grid item={true} xs={12}>
        <CheckboxField name="premium" label="Premium" />
      </Grid>
      <Grid item={true} xs={12}>
        <TextField fullWidth={true} name="sku" label="SKU" placeholder="SKU" />
      </Grid>
      <Grid item={true} xs={12}>
        <NumberField
          fullWidth={true}
          name="mapsSize"
          label="Maps size (bytes)"
          placeholder="Maps size (bytes)"
        />
      </Grid>
      <Grid item={true} xs={12}>
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
  );
});

RegionAdminSettingsMain.displayName = 'RegionAdminSettingsMain';

export default RegionAdminSettingsMain;
