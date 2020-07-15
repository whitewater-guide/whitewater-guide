import Box from '@material-ui/core/Box';
import React from 'react';
import {
  DateTimeField,
  CheckboxField,
  NumberField,
  TextField,
} from '../../../formik/fields';
import Grid from '@material-ui/core/Grid';

// TODO:
// - level
// - section
const GaugeFormMain: React.FC = React.memo(() => {
  return (
    <Box padding={1} overflow="auto">
      <Grid container={true} spacing={1}>
        <Grid sm={12}>
          <DateTimeField name="startedAt" label="Started at" />
        </Grid>
        <Grid sm={12}>
          <NumberField fullWidth={true} name="duration" label="Duration, s" />
        </Grid>
        <Grid sm={12}>
          <TextField
            fullWidth={true}
            name="comment"
            multiline={true}
            label="Comment"
          />
        </Grid>
        <Grid sm={12}>
          <CheckboxField name="public" label="Public" />
        </Grid>
      </Grid>
    </Box>
  );
});

GaugeFormMain.displayName = 'GaugeFormMain';

export default GaugeFormMain;
