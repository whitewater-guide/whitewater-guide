import React from 'react';
import MUITextField from 'material-ui/TextField';
import { strToFloat } from '../../commons/utils/TextUtils';

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export class TextField extends React.Component {
  static propTypes = {
    ...MUITextField.propTypes,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: String(props.value || ''),
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextVal = nextProps.value;
    if (nextProps.type === 'number' && strToFloat(nextVal) !== strToFloat(this.state.value)) {
      const value = isNaN(nextVal) ? '' : String(nextVal);
      this.setState({ value });
    }
  }

  onChange = (e, value) => {
    const { type, onChange } = this.props;
    this.setState({ value });
    const castValue = type === 'number' ? strToFloat(value) : value;
    if (type === 'number' && value === '-') {
      return;
    }
    if (onChange) {
      onChange(e, castValue);
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
