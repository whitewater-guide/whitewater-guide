import { ToggleProps } from 'material-ui';
import Toggle from 'material-ui/Toggle';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';

const styles = {
  container: {
    paddingTop: 12,
  },
};

type OwnProps = Partial<ToggleProps>;

type Props = WrappedFieldProps & OwnProps;

const SwitchComponent: React.StatelessComponent<Props> = ({ input, meta, ...own }) => {
  return (
    <Toggle{...own} toggled={input.value || false} onToggle={input.onChange} style={styles.container} />
  );
};

type FieldProps = BaseFieldProps<OwnProps> & OwnProps;

export const Switch: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<OwnProps>;
  return (
    <CustomField {...props as any} component={SwitchComponent} />
  );
};
