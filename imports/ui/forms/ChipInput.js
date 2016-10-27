import React, { Component, PropTypes } from 'react';
import MUIChipInput from 'material-ui-chip-input';
import _ from 'lodash';

class ChipInput extends Component {
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
      value: PropTypes.array,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  render() {
    const value = this.props.field.value === undefined ? [] : this.props.field.value;
    return (
      <MUIChipInput
        style={style}
        value={value}
        dataSource={this.props.options}
        dataSourceConfig={{text: 'label', value: 'value'}}
        errorText={this.props.field.error}
        onRequestAdd={this.onRequestAdd}
        onRequestDelete={this.onRequestDelete}
        floatingLabelText={this.props.title}
        hintText={this.props.title}
      />
    );
  }

  onRequestAdd = (chip) => {
    const value = this.props.field.value || [];
    this.props.field.onChange([...value, chip]);
  };

  onRequestDelete = (chip) => {
    this.props.field.onChange(_.filter(this.props.field.value, (item) => item.value !== chip));
  };
}

const style = {
  width: '100%',
};

export default ChipInput;