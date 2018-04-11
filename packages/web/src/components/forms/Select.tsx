import { SelectFieldProps } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { NamedNode } from '../../ww-commons';

interface SelectComponentProps extends Partial<SelectFieldProps> {
  options: NamedNode[];
  nullable?: boolean;
  simple?: boolean; // value is id string and not NamedNode
  title: string;
}

type Props = WrappedFieldProps & SelectComponentProps;

class SelectComponent extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    simple: true,
  };

  getValue = () => {
    const { input, options, simple, nullable } = this.props;
    const { value } = input;
    if (nullable && value === null) {
      return null;
    }
    const findId = simple ? value : value.id;
    const option = options.find(({ id }) => id === findId) || options[0];
    return option;
  };

  onChange = (event: any, index: number, value: string | NamedNode | null) => {
    const { input, simple } = this.props;
    if (value === null) {
      input.onChange(null);
    } else {
      input.onChange(simple ? (value as NamedNode).id : value);
    }
  };

  renderItem = (item: NamedNode) => {
    return (
      <MenuItem key={item.id} value={item} primaryText={item.name} />
    );
  };

  render() {
    const { input, meta, simple, nullable, title, options, ...props } = this.props;
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
        {nullable && <MenuItem key="nullable" value={null} primaryText="" />}
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
