import { DateTimePicker } from '@material-ui/pickers';

import React from 'react';
import { useField } from 'formik';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  label?: string;
}

export const DateTimeField: React.FC<Props> = ({ name, label }) => {
  const [field] = useField<Date>(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <DateTimePicker
      showTodayButton={true}
      value={field.value}
      onChange={onChange}
      label={label}
    />
  );
};
