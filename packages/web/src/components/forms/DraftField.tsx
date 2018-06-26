import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import DraftEditor from './draft';

type Props = WrappedFieldProps;

class DraftEditorComponent extends React.PureComponent<Props> {
  render() {
    return (
      <DraftEditor
        value={this.props.input.value}
        onChange={this.props.input.onChange}
      />
    );
  }
}

type FieldProps = BaseFieldProps<{}>;

export const DraftField: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<{}>;
  return (
    <CustomField
      {...props}
      component={DraftEditorComponent}
    />
  );
};
