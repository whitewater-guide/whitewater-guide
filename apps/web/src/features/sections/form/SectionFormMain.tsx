import Grid from '@material-ui/core/Grid';
import React from 'react';

import {
  AutocompleteField,
  CheckboxField,
  MultiTextField,
  RatingField,
  TextField,
} from '../../../formik/fields';
import { TIMEZONES } from '../../../utils/timezones';
import { DifficultyField } from './DifficultyField';
import { SectionRiverField } from './SectionRiverField';

export const SectionFormMain: React.FC = () => (
  <Grid container spacing={4}>
    <Grid item xs={12}>
      <SectionRiverField />
    </Grid>

    <Grid item xs={12}>
      <TextField fullWidth name="name" label="Name" placeholder="Name" />
    </Grid>

    <Grid item xs={12}>
      <MultiTextField
        fullWidth
        name="altNames"
        label="Alternative names"
        placeholder="Alternative names"
      />
    </Grid>

    <Grid item xs={12} container spacing={1}>
      <Grid item xs={4}>
        <DifficultyField
          fullWidth
          name="difficulty"
          label="Difficulty"
          placeholder="Difficulty"
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          name="difficultyXtra"
          label="Difficulty (extra)"
          placeholder="Difficulty (extra)"
        />
      </Grid>
      <Grid item xs={4}>
        <RatingField name="rating" label="Rating" />
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <AutocompleteField
        name="timezone"
        options={TIMEZONES}
        allowNull
        placeholder="Select timezone"
        label="Timezone"
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        name="helpNeeded"
        label="Community help needed"
        placeholder="Community help needed"
      />
    </Grid>

    <Grid item xs={12}>
      <CheckboxField name="hidden" label="Hidden from users" />
    </Grid>
  </Grid>
);
