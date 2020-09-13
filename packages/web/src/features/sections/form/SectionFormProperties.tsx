import Grid from '@material-ui/core/Grid';
import { Durations } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import React from 'react';

import { AutocompleteMenuProps } from '../../../components/autocomplete';
import {
  NumberField,
  SeasonPickerField,
  SelectField,
  SelectFieldPreset,
  TagsField,
  TextField,
} from '../../../formik/fields';
import { QResult } from './sectionForm.query';

type DurationOption = [number, string] | null;
const DURATIONS: DurationOption[] = Array.from(Durations.entries()).concat(
  null as any,
);

const DurationsSelectPreset: SelectFieldPreset<
  DurationOption,
  number | null
> = {
  optionToValue: (o) => (o === null ? null : o[0]),
  optionToKey: (o) => (o === null ? 'null' : o[0]),
  optionToLabel: (o) => (o === null ? 'unknown' : o[1]),
  valueToKey: (v) => (v === null ? 'null' : v),
};

const tagsMenuProps: AutocompleteMenuProps = {
  placement: 'bottom-start',
  modifiers: {
    flip: {
      enabled: true,
    },
  },
};

interface Props {
  tags: QResult['tags'];
}

export const SectionFormProperties: React.FC<Props> = (props) => {
  const { kayaking = [], hazards = [], supply = [], misc = [] } = groupBy(
    props.tags,
    'category',
  );

  return (
    <Grid container={true} spacing={4}>
      <Grid item={true} xs={12} container={true} spacing={1}>
        <Grid item={true} xs={4}>
          <NumberField
            fullWidth={true}
            name="drop"
            label="Drop, m"
            placeholder="Drop, m"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <NumberField
            fullWidth={true}
            name="distance"
            label="Length, km"
            placeholder="Length, km"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <SelectField
            {...DurationsSelectPreset}
            fullWidth={true}
            name="duration"
            options={DURATIONS}
            label="Duration"
            placeholder="Duration"
          />
        </Grid>
      </Grid>

      <Grid item={true} xs={12}>
        <TextField
          fullWidth={true}
          name="season"
          label="Season"
          placeholder="Season"
        />
      </Grid>

      <Grid item={true} xs={12}>
        <SeasonPickerField name="seasonNumeric" />
      </Grid>

      <Grid item={true} xs={12}>
        <TagsField name="supplyTags" label="River supply" options={supply} />
      </Grid>

      <Grid item={true} xs={12}>
        <TagsField
          name="kayakingTags"
          label="Kayaking types"
          options={kayaking}
        />
      </Grid>

      <Grid item={true} xs={12}>
        <TagsField name="hazardsTags" label="Hazards" options={hazards} />
      </Grid>

      <Grid item={true} xs={12}>
        <TagsField name="miscTags" label="Tags" options={misc} />
      </Grid>
    </Grid>
  );
};
