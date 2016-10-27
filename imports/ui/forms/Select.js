import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Select extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.string,
      }),
    ),
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  render() {
    return (
      <SelectField
        style={style}
        value={this.props.field.value}
        onChange={this.onChange}
        errorText={this.props.field.error}
        floatingLabelText={this.props.title}
      >
        {this.props.options.map(item => (<MenuItem key={item.value} value={item.value} primaryText={item.label} />))}
      </SelectField>
    );
  }

  onChange = (event, index, value) => {
    this.props.field.onChange(value);
  };
}

const style = {
  width: '100%',
};

export default Select;