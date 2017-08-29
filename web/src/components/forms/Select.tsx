import { SelectFieldProps } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { NamedResource } from '../../ww-commons';

interface SelectComponentProps extends Partial<SelectFieldProps> {
  options: NamedResource[];
  simple?: boolean; // value is id string and not NamedResource
  title: string;
}

type Props = WrappedFieldProps & SelectComponentProps;

class SelectComponent extends React.PureComponent<Props> {
  getValue = () => {
    const { input, options, simple } = this.props;
    const { value } = input;
    const findId = simple ? value : value.id;
    const option = options.find(({ id }) => id === findId) || options[0];
    return simple ? option.id : option;
  };

  onChange = (event: any, index: number, value: string | NamedResource) => {
    const { input, simple } = this.props;
    input.onChange(simple ? (value as NamedResource).id : value);
  };

  renderItem = (item: NamedResource) => {
    return (
      <MenuItem key={item.id} value={item} primaryText={item.name} />
    );
  };

  render() {
    const { input, meta, title, options, ...props } = this.props;
    const value = this.getValue();
    return (
      <SelectField
        {...props}
        fullWidth
        value={value}
        onChange={this.onChange}
        floatingLabelText={title}
        hintText={title}
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
