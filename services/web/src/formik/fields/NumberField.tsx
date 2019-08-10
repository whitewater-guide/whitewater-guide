import { InputProps } from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { useField } from 'formik';
import React from 'react';
import { NumberInput } from '../../components';
import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const NumberField: React.FC<Props> = (props) => {
  const { name, label, ...inputProps } = props;
  const [field] = useField<number | null>(name);
  const handlers = useFakeHandlers(name);
  const id = `numberfield-${name}`;

  return (
    <FormikFormControl name={name} inputId={id} fullWidth={props.fullWidth}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <NumberInput
        {...inputProps}
        {...handlers}
        value={field.value}
        name={name}
        id={id}
        aria-describedby={`${id}-error`}
      />
    </FormikFormControl>
  );
};

NumberField.displayName = 'NumberField';
