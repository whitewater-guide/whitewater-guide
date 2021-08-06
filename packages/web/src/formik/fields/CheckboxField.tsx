import MUICheckbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useField } from 'formik';
import React from 'react';

import { FormikFormControl } from '../helpers';

interface Props extends CheckboxProps {
  name: string;
  label?: string;
}

export const CheckboxField = React.memo<Props>((props) => {
  const { name, label, ...checkboxProps } = props;
  const [field] = useField<boolean>(name);
  const id = `checkbox-${name}`;
  return (
    <FormikFormControl inputId={id} name={name}>
      <FormControlLabel
        control={
          <MUICheckbox
            {...checkboxProps}
            {...field}
            value={!!field.value}
            checked={!!field.value}
            id={id}
          />
        }
        label={label}
      />
    </FormikFormControl>
  );
});

CheckboxField.displayName = 'CheckboxField';
