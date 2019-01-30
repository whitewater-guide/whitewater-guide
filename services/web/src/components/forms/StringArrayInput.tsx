import { reject } from 'lodash';
import MUIChipInput from 'material-ui-chip-input';
import React from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';

interface StringArrayInputProps {
  title: string;
}

type Props = WrappedFieldProps & StringArrayInputProps;

class StringArrayInputComponent extends React.PureComponent<Props> {
  onRequestAdd = (chip: string) => {
    const value = this.props.input.value || [];
    this.props.input.onChange([...value, chip]);
  };

  onRequestDelete = (chip: string) => {
    const {
      input: { value, onChange },
    } = this.props;
    onChange(reject(value, (v) => v === chip));
  };

  onBlur = (event: any) => {
    const value = this.props.input.value || [];
    const newName = event.target.value;
    if (newName) {
      this.props.input.onChange([...value, newName]);
    }
  };

  render() {
    const { input, meta, title } = this.props;
    return (
      <MUIChipInput
        fullWidth
        value={input.value}
        hintText={this.props.title}
        floatingLabelText={this.props.title}
        errorText={this.props.meta.error}
        onRequestAdd={this.onRequestAdd}
        onRequestDelete={this.onRequestDelete}
        onBlur={this.onBlur}
        newChipKeyCodes={[13, 188, 59]}
      />
    );
  }
}

type FieldProps = BaseFieldProps<StringArrayInputProps> & StringArrayInputProps;

export const StringArrayInput: React.StatelessComponent<FieldProps> = (
  props,
) => {
  const CustomField = Field as new () => GenericField<StringArrayInputProps>;
  return <CustomField {...props} component={StringArrayInputComponent} />;
};
