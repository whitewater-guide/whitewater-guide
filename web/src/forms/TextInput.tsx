import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isNil } from 'lodash';
import { TextField } from '../components';

const styles = {
  textInput: {
    minWidth: 20,
  },
};

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
    const value = isNil(this.props.field.value) ? '' : this.props.field.value;
    return (
      <TextField
        fullWidth
        style={styles.textInput}
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

