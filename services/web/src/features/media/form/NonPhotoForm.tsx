import React from 'react';
import { NumberField, TextField } from '../../../formik/fields';

const NonPhotoForm: React.FC = React.memo(() => {
  return (
    <React.Fragment>
      <TextField
        multiline={true}
        fullWidth={true}
        name="description"
        label="Description"
        placeholder="Description"
      />
      <TextField
        fullWidth={true}
        name="copyright"
        label="Copyright"
        placeholder="Copyright"
      />
      <TextField fullWidth={true} name="url" label="URL" placeholder="URL" />
      <NumberField
        fullWidth={true}
        name="weight"
        label="Sort weight"
        placeholder="Sort weight"
      />
    </React.Fragment>
  );
});

NonPhotoForm.displayName = 'NonPhotoForm';

export default NonPhotoForm;
