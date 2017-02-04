import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Select extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    extractKey: PropTypes.func,
    extractValue: PropTypes.func,
    extractLabel: PropTypes.func,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  static defaultProps = {
    options: [],
    disabled: false,
    extractKey: item => item._id,
    extractValue: item => item._id,
    extractLabel: item => item.name,
  };

  render() {
    return (
      <SelectField
        style={style}
        disabled={this.props.disabled}
        value={this.props.field.value}
        onChange={this.onChange}
        errorText={this.props.field.error}
        floatingLabelText={this.props.title}
      >
        {this.props.options.map(this.renderItem)}
      </SelectField>
    );
  }

  renderItem = (item) => {
    const {extractKey, extractValue, extractLabel} = this.props;
    return (
      <MenuItem key={extractKey(item)} value={extractValue(item)} primaryText={extractLabel(item)} />
    );
  };

  onChange = (event, index, value) => {
    this.props.field.onChange(value);
  };
}

const style = {
  width: '100%',
};

export default Select;