import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';
import { useField, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback, useMemo } from 'react';

import { FormikFormControl } from '../../helpers';

/**
 * O = options to display (e.g. NamedNode[])
 * V = actual value, (e.g. string id of NamedNode, or NamedNode itself)
 * key here means raw input value (which is strictly string)
 */
export interface SelectFieldProps<O = any, V = any>
  extends Partial<SelectProps> {
  name: string;
  options: O[];
  optionToValue: (option: O) => V;
  optionToLabel: (option: O) => string;
  optionToKey: (option: O) => string | number;
  valueToKey: (value: V) => string | number;
  label?: string;
}

export const SelectField = React.memo<SelectFieldProps>((props) => {
  const {
    name,
    options,
    optionToValue,
    optionToLabel,
    optionToKey,
    valueToKey,
    fullWidth,
    label,
    placeholder,
    ...rest
  } = props;

  const [{ value, onBlur }] = useField(name);
  const { setFieldValue } = useFormikContext<any>();
  const id = `select-${name}`;

  const renderItem = useCallback(
    (item: any) => {
      const key = optionToKey(item);
      return (
        <MenuItem key={key} value={key}>
          {optionToLabel(item)}
        </MenuItem>
      );
    },
    [optionToKey, optionToLabel],
  );

  const onChange = useCallback(
    (e: ChangeEvent<{ value: string }>) => {
      const option = options.find((o) => optionToKey(o) === e.target.value);
      if (option !== undefined) {
        setFieldValue(name, optionToValue(option));
      }
    },
    [name, setFieldValue, options, optionToValue, optionToKey],
  );

  const findKey = useCallback(
    (v: any): string | number => {
      const option = options.find((o) => optionToKey(o) === valueToKey(v));
      return option === undefined
        ? optionToKey(options[0])
        : optionToKey(option);
    },
    [options, optionToKey, valueToKey],
  );

  const selectedKey = useMemo(() => findKey(value), [value, findKey]);

  return (
    <FormikFormControl name={name} inputId={id} fullWidth={fullWidth}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        {...rest}
        onBlur={onBlur}
        placeholder={placeholder}
        fullWidth={fullWidth}
        value={selectedKey}
        onChange={onChange}
        input={<Input id={id} name={name} />}
      >
        {options.map(renderItem)}
      </Select>
    </FormikFormControl>
  );
});

SelectField.displayName = 'SelectField';
