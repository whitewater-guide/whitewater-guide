import { reject } from 'lodash';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { NamedNode } from '../../ww-commons';
import { ChipList } from '../ChipList';

interface ChipInputProps {
  options: NamedNode[];
  title: string;
}

type Props = WrappedFieldProps & ChipInputProps;

class ChipInputComponent extends React.PureComponent<Props> {

  onRequestAdd = (chip: NamedNode) => {
    const value = this.props.input.value || [];
    this.props.input.onChange([...value, chip]);
  };

  onRequestDelete = (id: string) => {
    const { input: { value, onChange } } = this.props;
    // console.log('On chip delete', value, chip);
    onChange(reject(value, { id }));
  };

  render() {
    const { input, options, title } = this.props;
    return (
      <ChipList
        options={options}
        values={input.value}
        onRequestAdd={this.onRequestAdd}
        onRequestDelete={this.onRequestDelete}
        title={title}
        errorText={this.props.meta.error}
      />
    );
  }
}

type FieldProps = BaseFieldProps<ChipInputProps> & ChipInputProps;

export const ChipInput: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<ChipInputProps>;
  return (
    <CustomField {...props} component={ChipInputComponent} />
  );
};
