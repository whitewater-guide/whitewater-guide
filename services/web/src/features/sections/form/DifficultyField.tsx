import { toRomanDifficulty } from '@whitewater-guide/commons';
import times from 'lodash/times';
import React from 'react';
import { SelectField, SelectFieldPreset } from '../../../formik/fields/select';

const VALUES = [0].concat(times(11).map((n) => n + 2)).map((value) => ({
  value: value * 0.5,
  label: toRomanDifficulty(value * 0.5),
}));

const preset: SelectFieldPreset<{ value: number; label: string }, number> = {
  valueToKey: (v) => v,
  optionToLabel: (o) => o.label,
  optionToKey: (o) => o.value,
  optionToValue: (o) => o.value,
};

interface Props {
  name: string;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
}

export const DifficultyField: React.FC<Props> = React.memo((props) => {
  return <SelectField options={VALUES} {...preset} {...props} />;
});

DifficultyField.displayName = 'DifficultyField';
