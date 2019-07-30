import { NamedNode } from '@whitewater-guide/commons';
import { SelectFieldProps } from './SelectField';

export type SelectFieldPreset<O, V> = Pick<
  SelectFieldProps<O, V>,
  'optionToKey' | 'optionToLabel' | 'optionToValue' | 'valueToKey'
>;

const NamedNodePreset: SelectFieldPreset<NamedNode, NamedNode> = {
  optionToKey: (o) => o.id,
  optionToLabel: (o) => o.name,
  optionToValue: (o) => o,
  valueToKey: (v) => v.id,
};

const NamedNodeIdPreset: SelectFieldPreset<NamedNode, string> = {
  optionToKey: (o) => o.id,
  optionToLabel: (o) => o.name,
  optionToValue: (o) => o.id,
  valueToKey: (v) => v,
};

export const SelectFieldPresets = {
  NamedNode: NamedNodePreset,
  NamedNodeId: NamedNodeIdPreset,
};
