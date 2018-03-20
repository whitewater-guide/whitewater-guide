import { SelectFieldProps } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { NamedNode } from '../../ww-commons';

interface SelectComponentProps extends Partial<SelectFieldProps> {
  options: NamedNode[];
  simple?: boolean; // value is id string and not NamedNode
  title: string;
}

type Props = WrappedFieldProps & SelectComponentProps;

class SelectComponent extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    simple: true,
  };

  getValue = () => {
    const { input, options, simple } = this.props;
    const { value } = input;
    const findId = simple ? value : value.id;
    const option = options.find(({ id }) => id === findId) || options[0];
    return option;
  };

  onChange = (event: any, index: number, value: string | NamedNode) => {
    const { input, simple } = this.props;
    input.onChange(simple ? (value as NamedNode).id : value);
  };

  renderItem = (item: NamedNode) => {
    return (
      <MenuItem key={item.id} value={item} primaryText={item.name} />
    );
  };

  render() {
    const { input, meta, simple, title, options, ...props } = this.props;
    const value = this.getValue();
    return (
      <SelectField
        {...props}
        fullWidth
        value={value}
        onChange={this.onChange}
        floatingLabelText={title}
        hintText={title}
        errorText={meta.touched && meta.error}
      >
        {options.map(this.renderItem)}
      </SelectField>
    );
  }

}

type FieldProps = BaseFieldProps<SelectComponentProps> & SelectComponentProps;

export const Select: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<SelectComponentProps>;
  return (
    <CustomField {...props} component={SelectComponent} />
  );
};
