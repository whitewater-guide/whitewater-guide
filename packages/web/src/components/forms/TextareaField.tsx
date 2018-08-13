import { MdEditor } from '@whitewater-guide/md-editor';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';

type Props = WrappedFieldProps;

class TextareaComponent extends React.PureComponent<Props> {
  render() {
    return (
      <MdEditor
        value={this.props.input.value}
        onChange={this.props.input.onChange}
      />
    );
  }
}

type FieldProps = BaseFieldProps<{}>;

export const TextareaField: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<{}>;
  return (
    <CustomField
      {...props}
      component={TextareaComponent}
    />
  );
};
