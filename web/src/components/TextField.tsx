/* tslint:disable:member-ordering */
import MUITextField from 'material-ui/TextField';
import * as React from 'react';
import { strToFloat } from '../ww-clients/utils/TextUtils';

// Copied from @types/material-ui because it is not exported there
interface TextFieldProps {
  className?: string;
  defaultValue?: string | number;
  disabled?: boolean;
  errorStyle?: React.CSSProperties;
  errorText?: React.ReactNode;
  floatingLabelFixed?: boolean;
  floatingLabelFocusStyle?: React.CSSProperties;
  floatingLabelShrinkStyle?: React.CSSProperties;
  floatingLabelStyle?: React.CSSProperties;
  floatingLabelText?: React.ReactNode;
  fullWidth?: boolean;
  hintStyle?: React.CSSProperties;
  hintText?: React.ReactNode;
  id?: string;
  inputStyle?: React.CSSProperties;
  multiLine?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler<{}>;
  onFocus?: React.FocusEventHandler<{}>;
  onKeyDown?: React.KeyboardEventHandler<{}>;
  onKeyUp?: React.KeyboardEventHandler<{}>;
  onKeyPress?: React.KeyboardEventHandler<{}>;
  required?: boolean;
  rows?: number;
  rowsMax?: number;
  style?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  type?: string;
  underlineDisabledStyle?: React.CSSProperties;
  underlineFocusStyle?: React.CSSProperties;
  underlineShow?: boolean;
  underlineStyle?: React.CSSProperties;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  maxlength?: string;
  minlegnth?: string;
  step?: number;
  autoComplete?: string;
  // Modified props
  value?: string | number | null;
  onChange?: (newValue: string | number) => void;
}

interface State {
  value: string;
}

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export class TextField extends React.Component<TextFieldProps, State> {

  constructor(props: TextFieldProps) {
    super(props);
    this.state = {
      value: String(props.value || ''),
    };
  }

  componentWillReceiveProps(nextProps: TextFieldProps) {
    const nextVal = nextProps.value;
    if (nextProps.type === 'number' && strToFloat(nextVal) !== strToFloat(this.state.value)) {
      const value = (typeof nextVal === 'number' && isNaN(nextVal)) ? '' : String(nextVal);
      this.setState({ value });
    }
  }

  onChange = (e: any, value: string) => {
    const { type, onChange } = this.props;
    this.setState({ value });
    const castValue = type === 'number' ? strToFloat(value) : value;
    if (type === 'number' && value === '-') {
      return;
    }
    if (onChange) {
      onChange(castValue);
    }
  };

  render() {
    const { type, value, onChange, ...rest } = this.props;
    const numericProps = type === 'number' ? { pattern: '(\-)?[0-9]+([\,|\.][0-9]+)?' } : { type };
    return (
      <MUITextField
        {...rest}
        {...numericProps}
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }

}
