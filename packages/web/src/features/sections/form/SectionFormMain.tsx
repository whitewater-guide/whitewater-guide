import Grid from '@material-ui/core/Grid';
import React from 'react';

import {
  CheckboxField,
  MultiTextField,
  RatingField,
  TextField,
} from '../../../formik/fields';
import { DifficultyField } from './DifficultyField';
import { SectionRiverField } from './SectionRiverField';

export const SectionFormMain: React.FC = () => {
  return (
    <Grid container={true} spacing={4}>
      <Grid item={true} xs={12}>
        <SectionRiverField />
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="name"
          label="Name"
          placeholder="Name"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <MultiTextField
          fullWidth={true}
          name="altNames"
          label="Alternative names"
          placeholder="Alternative names"
        />
      </Grid>

      <Grid item={true} xs={12} container={true} spacing={1}>
        <Grid item={true} xs={4}>
          <DifficultyField
            fullWidth={true}
            name="difficulty"
            label="Difficulty"
            placeholder="Difficulty"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField
            fullWidth={true}
            name="difficultyXtra"
            label="Difficulty (extra)"
            placeholder="Difficulty (extra)"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <RatingField name="rating" label="Rating" />
        </Grid>
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="helpNeeded"
          label="Community help needed"
          placeholder="Community help needed"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <CheckboxField name="hidden" label="Hidden from users" />
      </Grid>
    </Grid>
  );
};
