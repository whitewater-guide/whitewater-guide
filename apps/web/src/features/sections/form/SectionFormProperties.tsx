import Grid from '@material-ui/core/Grid';
import { Durations } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import React from 'react';

import type { SelectFieldPreset } from '../../../formik/fields';
import {
  NumberField,
  SeasonPickerField,
  SelectField,
  TagsField,
  TextField,
} from '../../../formik/fields';
import type { SectionFormQuery } from './sectionForm.generated';

type DurationOption = [number, string] | null;
const DURATIONS: DurationOption[] = Array.from(Durations.entries()).concat(
  null as any,
);

const DurationsSelectPreset: SelectFieldPreset<DurationOption, number | null> =
  {
    optionToValue: (o) => (o === null ? null : o[0]),
    optionToKey: (o) => (o === null ? 'null' : o[0]),
    optionToLabel: (o) => (o === null ? 'unknown' : o[1]),
    valueToKey: (v) => (v === null ? 'null' : v),
  };

interface Props {
  tags: SectionFormQuery['tags'];
}

export const SectionFormProperties: React.FC<Props> = (props) => {
  const {
    kayaking = [],
    hazards = [],
    supply = [],
    misc = [],
  } = groupBy(props.tags, 'category');

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} container spacing={1}>
        <Grid item xs={4}>
          <NumberField
            fullWidth
            name="drop"
            label="Drop, m"
            placeholder="Drop, m"
          />
        </Grid>
        <Grid item xs={4}>
          <NumberField
            fullWidth
            name="distance"
            label="Length, km"
            placeholder="Length, km"
          />
        </Grid>
        <Grid item xs={4}>
          <SelectField
            {...DurationsSelectPreset}
            fullWidth
            name="duration"
            options={DURATIONS}
            label="Duration"
            placeholder="Duration"
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="season"
          label="Season"
          placeholder="Season"
        />
      </Grid>

      <Grid item xs={12}>
        <SeasonPickerField name="seasonNumeric" />
      </Grid>

      <Grid item xs={12}>
        <TagsField name="supplyTags" label="River supply" options={supply} />
      </Grid>

      <Grid item xs={12}>
        <TagsField
          name="kayakingTags"
          label="Kayaking types"
          options={kayaking}
        />
      </Grid>

      <Grid item xs={12}>
        <TagsField name="hazardsTags" label="Hazards" options={hazards} />
      </Grid>

      <Grid item xs={12}>
        <TagsField name="miscTags" label="Tags" options={misc} />
      </Grid>
    </Grid>
  );
};
