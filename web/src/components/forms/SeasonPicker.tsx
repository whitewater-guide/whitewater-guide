import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import Picker from '../SeasonPicker';

interface WithTitle {
  title?: string;
}
type Props = WrappedFieldProps & WithTitle;

const SeasonPickerComponent: React.StatelessComponent<Props> = ({ input, meta, ...own }) => (
  <Picker {...own} value={input.value} onChange={input.onChange} />
);

type FieldProps = BaseFieldProps<WithTitle> & WithTitle;

export const SeasonPicker: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<WithTitle>;
  return (
    <CustomField {...props} component={SeasonPickerComponent} />
  );
};
