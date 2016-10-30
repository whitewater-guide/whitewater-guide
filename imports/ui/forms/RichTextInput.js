import React, { Component, PropTypes } from 'react';
import Quill from 'react-quill';
import '../../../node_modules/quill/dist/quill.snow.css';

class RichTextInput extends Component {
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
      <Quill
        value={value}
        onChange={this.props.field.onChange}
      />
    );
  }
}

export default RichTextInput;