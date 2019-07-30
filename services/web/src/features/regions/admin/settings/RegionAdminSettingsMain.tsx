import Grid from '@material-ui/core/Grid';
import { UploadLink } from '@whitewater-guide/commons';
import React from 'react';
import {
  CheckboxField,
  ImageUploadField,
  NumberField,
  TextField,
} from '../../../../formik/fields';

interface Props {
  uploadLink: UploadLink;
}

const RegionAdminSettingsMain: React.FC<Props> = React.memo((props) => {
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
          name="coverImage.mobile"
          bucket="covers"
          width={2048}
          height={682}
          previewScale={0.2}
          upload={props.uploadLink}
        />
      </Grid>
    </Grid>
  );
});

RegionAdminSettingsMain.displayName = 'RegionAdminSettingsMain';

export default RegionAdminSettingsMain;
