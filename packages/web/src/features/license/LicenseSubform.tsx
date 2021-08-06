import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { License } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import React, { FC } from 'react';

import { TextField } from '../../formik/fields/TextField';
import CommonLicenses from './CommonLicenses';

interface Props {
  prefix?: string;
  name?: string;
  inheritLabel?: string;
}

export const LicenseSubform: FC<Props> = (props) => {
  const { prefix = '', name = 'license', inheritLabel = 'Inherit' } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, values } = useFormikContext<any>();
  const fieldName = `${prefix}${name}`;
  const value: License | null = get(values, fieldName, null);

  return (
    <>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!value}
              onChange={(_, checked) => {
                setFieldValue(fieldName, checked ? null : { name: '' });
              }}
              color="primary"
            />
          }
          label={inheritLabel}
        />

        {!!value && <CommonLicenses name={fieldName} />}
      </Grid>

      <Grid item xs={12}>
        <Collapse in={!!value}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              name={`${fieldName}.slug`}
              label="License slug"
              placeholder="License slug"
              disabled={!value}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              name={`${fieldName}.name`}
              label="License name"
              placeholder="License name"
              disabled={!value}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              name={`${fieldName}.url`}
              label="License URL"
              placeholder="License URL"
              disabled={!value}
            />
          </Grid>
        </Collapse>
      </Grid>
    </>
  );
};
