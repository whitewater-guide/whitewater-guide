import React from 'react';
import { NumberField, TextField } from '../../../../formik/fields';

interface Props {
  prefix?: string;
}

const NonPhotoForm: React.FC<Props> = React.memo(({ prefix = '' }) => {
  return (
    <React.Fragment>
      <TextField
        multiline={true}
        fullWidth={true}
        name={`${prefix}description`}
        label="Description"
        placeholder="Description"
      />
      <TextField
        fullWidth={true}
        name={`${prefix}copyright`}
        label="Copyright"
        placeholder="Copyright"
      />
      <TextField
        fullWidth={true}
        name={`${prefix}url`}
        label="URL"
        placeholder="URL"
      />
      <NumberField
        fullWidth={true}
        name={`${prefix}weight`}
        label="Sort weight"
        placeholder="Sort weight"
      />
    </React.Fragment>
  );
});

NonPhotoForm.displayName = 'NonPhotoForm';

export default NonPhotoForm;
