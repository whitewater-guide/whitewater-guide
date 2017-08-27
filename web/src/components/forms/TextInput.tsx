import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { SeparatorAgnosticTextField, TFProps } from './SeparatorAgnosticTextField';

type CustomFieldProps = TFProps & { title?: string };

type Props = WrappedFieldProps & CustomFieldProps;

const TextInputComponent: React.StatelessComponent<Props> = ({ input, meta, ...own }) => (
  <SeparatorAgnosticTextField {...input} floatingLabelText={own.title} {...own} />
);

type FieldProps = BaseFieldProps<CustomFieldProps> & CustomFieldProps;

export const TextInput: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<CustomFieldProps>;
  return (
    <CustomField {...props} component={TextInputComponent} />
  );
};
