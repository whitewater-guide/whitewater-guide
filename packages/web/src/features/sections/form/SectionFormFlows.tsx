import Grid from '@material-ui/core/Grid';
import React from 'react';

import {
  AutocompleteField,
  CheckboxField,
  NumberField,
  TextField,
} from '../../../formik/fields';
import { SectionFormQuery } from './sectionForm.generated';

interface Props {
  gauges: SectionFormQuery['gauges'] | null;
}

export const SectionFormFlows: React.FC<Props> = ({ gauges }) => (
  <Grid container spacing={4}>
    <Grid item xs={12}>
      <AutocompleteField
        name="gauge"
        options={gauges ? gauges.nodes : []}
        allowNull
        placeholder="Select gauge"
        label="Gauge"
      />
    </Grid>

    <Grid item xs={12} container spacing={1}>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="levels.minimum"
          label="Minimal level"
          placeholder="Minimal level"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="levels.optimum"
          label="Optimal level"
          placeholder="Optimal level"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="levels.maximum"
          label="Maximal level"
          placeholder="Maximal level"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="levels.impossible"
          label="Absolute maximum"
          placeholder="Absolute maximum"
        />
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2}>
        <CheckboxField name="levels.approximate" label="Approximate" />
      </Grid>
    </Grid>

    <Grid item xs={12} container spacing={1}>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="flows.minimum"
          label="Minimal flow"
          placeholder="Minimal flow"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="flows.optimum"
          label="Optimal flow"
          placeholder="Optimal flow"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="flows.maximum"
          label="Maximal flow"
          placeholder="Maximal flow"
        />
      </Grid>
      <Grid item xs={2}>
        <NumberField
          fullWidth
          name="flows.impossible"
          label="Absolute maximum"
          placeholder="Absolute maximum"
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          fullWidth
          name="flows.formula"
          label="Formula"
          placeholder="Formula"
        />
      </Grid>
      <Grid item xs={2}>
        <CheckboxField name="flows.approximate" label="Approximate" />
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        name="flowsText"
        label="Flows description"
        placeholder="Flows description"
      />
    </Grid>
  </Grid>
);
