import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class TextInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  render() {
    const value = this.props.field.value === undefined ? '' : this.props.field.value;
    return (
      <TextField value={value} errorText={this.props.field.error}
        onChange={(e, value) => this.props.field.onChange(value)}
        hintText={this.props.title} floatingLabelText={this.props.title} />
    );
  }
}

export default TextInput;