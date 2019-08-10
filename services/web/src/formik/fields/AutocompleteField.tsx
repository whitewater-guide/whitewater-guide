import { useField } from 'formik';
import React from 'react';
import { Autocomplete, AutocompleteProps } from '../../components/autocomplete';
import { useFakeHandlers } from '../utils';

type Props = Omit<AutocompleteProps, 'value' | 'onChange'> & { name: string };

export const AutocompleteField: React.FC<Props> = React.memo((props) => {
  const { name, ...autocompleteProps } = props;
  const [{ value }] = useField(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <Autocomplete {...autocompleteProps} value={value} onChange={onChange} />
  );
});

AutocompleteField.displayName = 'AutocompleteField';
