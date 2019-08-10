import Grid from '@material-ui/core/Grid';
import React from 'react';
import {
  AutocompleteField,
  CheckboxField,
  NumberField,
  TextField,
} from '../../../formik/fields';
import { squashConnection } from '../../../formik/utils';
import { QResult } from './sectionForm.query';

interface Props {
  region: QResult['region'] | null;
}

export const SectionFormFlows: React.FC<Props> = ({ region }) => {
  const gauges = squashConnection(region || undefined, 'gauges');
  return (
    <Grid container={true} spacing={4}>
      <Grid item={true} xs={12}>
        <AutocompleteField
          name="gauge"
          options={gauges}
          allowNull={true}
          placeholder="Select gauge"
          label="Gauge"
        />
      </Grid>

      <Grid item={true} xs={12} container={true} spacing={1}>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="levels.minimum"
            label="Minimal level"
            placeholder="Minimal level"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="levels.optimum"
            label="Optimal level"
            placeholder="Optimal level"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="levels.maximum"
            label="Maximal level"
            placeholder="Maximal level"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="levels.impossible"
            label="Absolute maximum"
            placeholder="Absolute maximum"
          />
        </Grid>
        <Grid item={true} xs={2} />
        <Grid item={true} xs={2}>
          <CheckboxField name="levels.approximate" label="Approximate" />
        </Grid>
      </Grid>

      <Grid item={true} xs={12} container={true} spacing={1}>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="flows.minimum"
            label="Minimal flow"
            placeholder="Minimal flow"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="flows.optimum"
            label="Optimal flow"
            placeholder="Optimal flow"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="flows.maximum"
            label="Maximal flow"
            placeholder="Maximal flow"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <NumberField
            fullWidth={true}
            name="flows.impossible"
            label="Absolute maximum"
            placeholder="Absolute maximum"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <TextField
            fullWidth={true}
            name="flows.formula"
            label="Formula"
            placeholder="Formula"
          />
        </Grid>
        <Grid item={true} xs={2}>
          <CheckboxField name="flows.approximate" label="Approximate" />
        </Grid>
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="flowsText"
          label="Flows description"
          placeholder="Flows description"
        />
      </Grid>
    </Grid>
  );
};
