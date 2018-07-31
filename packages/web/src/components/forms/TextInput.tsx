import { isFinite } from 'lodash';
import isString from 'lodash/isString';
import { TextFieldProps } from 'material-ui';
import TextField from 'material-ui/TextField';
import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { strToFloat } from '../../ww-clients/utils';

const SEPARATOR = (0.5).toString()[1];
const OTHER_SEPARATOR = SEPARATOR === ',' ? /\./ : /,/ ;

type CustomFieldProps = { title?: string } & Partial<TextFieldProps>;

type Props = WrappedFieldProps & CustomFieldProps;

class TextInputComponent extends React.PureComponent<Props> {
  onWheel = (e: React.SyntheticEvent) => e.preventDefault();

  render() {
    const { input, meta, ...own } = this.props;
    const errorText = meta.error && isString(meta.error) ? meta.error : JSON.stringify(meta.error);
    return (
      <TextField
        {...input}
        floatingLabelText={own.title}
        {...own}
        errorText={errorText}
        onWheel={this.onWheel}
      />
    );
  }
}

type FieldProps = BaseFieldProps<CustomFieldProps> & CustomFieldProps;

export const TextInput: React.StatelessComponent<FieldProps> = ({ ...props }) => {
  const CustomField = Field as new () => GenericField<CustomFieldProps>;
  const numericProps = props.type === 'number' ? {
    pattern: '(\-)?[0-9]+([\,|\.][0-9]+)?',
    format: (value?: number) => (isFinite(value) ? value!.toString() : ''),
    parse: (value?: string) => (value ? value.replace(OTHER_SEPARATOR, SEPARATOR) : value),
    normalize: (value?: string) => (value ? strToFloat(value) : null),
  } : { normalize: (value?: string) => value || null };
  return (
    <CustomField {...props} {...numericProps} component={TextInputComponent} />
  );
};
