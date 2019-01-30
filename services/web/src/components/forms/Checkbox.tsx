import { CheckboxProps } from 'material-ui';
import MUICheckbox from 'material-ui/Checkbox';
import React from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';

const styles = {
  container: {
    paddingTop: 12,
  },
};

type OwnProps = Partial<CheckboxProps>;

type Props = WrappedFieldProps & OwnProps;

const CheckboxComponent: React.StatelessComponent<Props> = ({
  input,
  meta,
  ...own
}) => {
  return (
    <MUICheckbox
      {...own}
      checked={input.value || false}
      onCheck={input.onChange}
      style={styles.container}
    />
  );
};

type FieldProps = BaseFieldProps<OwnProps> & OwnProps;

export const Checkbox: React.StatelessComponent<FieldProps> = (props) => {
  const CustomField = Field as new () => GenericField<OwnProps>;
  return <CustomField {...props as any} component={CheckboxComponent} />;
};
