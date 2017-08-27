import { TextFieldProps } from 'material-ui';
import MUITextField from 'material-ui/TextField';
import * as React from 'react';
import { strToFloat } from '../../ww-clients/utils/TextUtils';

// TODO: This doesn't work:
// see https://github.com/Microsoft/TypeScript/issues/12215
//
// import { Overwrite } from '../../ww-commons';
//
// interface AgnosticChange {
//   onChange: (value: string | number) => void;
// }
//
// export type TFProps = Overwrite<TextFieldProps, AgnosticChange>;

// Copy-paste from @types/material-ui and override onChange
export interface TFProps {
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
  onChange?: (value: number | string) => void;
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
  value?: string | number;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  maxlength?: string;
  minlength?: string;
  step?: number;
  autoComplete?: string;
}

interface State {
  value: string;
}

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export class SeparatorAgnosticTextField extends React.Component<TFProps, State> {

  constructor(props: TFProps) {
    super(props);
    this.state = {
      value: String(props.value || ''),
    };
  }

  componentWillReceiveProps(nextProps: TFProps) {
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
