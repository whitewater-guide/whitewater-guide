import React, { Component, PropTypes } from 'react';
import MUICheckbox from 'material-ui/Checkbox';

class Checkbox extends Component {
  static propTypes = {
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    type: PropTypes.string,
  };

  render() {
    return (
      <MUICheckbox
        label={this.props.title}
        checked={this.props.field.value}
        onCheck={(e, v) => this.props.field.onChange(v)}
      />
    );
  }
}

export default Checkbox;