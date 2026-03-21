import { useField } from 'formik';
import React from 'react';

import { SeasonPicker } from '../../components';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  title?: string;
}

export const SeasonPickerField = React.memo<Props>((props) => {
  const { name, title } = props;
  const [field] = useField<number[]>(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <SeasonPicker
      name={name}
      value={field.value}
      onChange={onChange}
      title={title}
    />
  );
});

SeasonPickerField.displayName = 'SeasonPickerField';
