import React, { Component, PropTypes } from 'react';
import TextField from '../components/TextField';

class TextInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    type: PropTypes.string,
  };

  render() {
    const value = this.props.field.value === undefined ? '' : this.props.field.value;
    return (
      <TextField
        fullWidth={true}
        value={value}
        errorText={this.props.field.error}
        onChange={this.onChange}
        hintText={this.props.title}
        floatingLabelText={this.props.title}
        type={this.props.type}
      />
    );
  }

  onChange = (e, value) => {
    this.props.field.onChange(value);
  }
}

export default TextInput;